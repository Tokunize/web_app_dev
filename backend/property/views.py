from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.db.models import Count
from collections import defaultdict
import calendar
from django.db.models.functions import TruncMonth
import os
import requests
import random
from datetime import timedelta, date
from wallet.serializers import WalletSerializer
from wallet.models import Wallet
from django.conf import settings  # Make sure to import settings to access the API key
from django.db.models import Sum
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from rest_framework.views import APIView
from property.models import Property,Token,Transaction,PropertyToken,PropertyMetrics
from .serializers import (
    PropertySerializerList,
    AllDetailsPropertySerializer,
    PropertyOverviewSerializer,
    PropertyImagesSerializer, 
    CreatePropertySerializer,
    PropertyFinancialsSerializer,
    TokenSerializer,
    TransactionSerializer,
    PropertyTokenPaymentSerializer,
    InvestedPropertiesSerialier,
    InvestmentOverviewSerializer,
    PropertyMetricsSerializer,
    UpdatePropertyStatusSerializer,
    PropertyUpdatesSerializer,
    MarketplaceListViewSerializer,
    AdminPropertyManagment,
    AdminOverviewSerializer,
    InvestorAssetsSerializer,
    PropertyTradeSellSerializer,
    InvestorTradingPropertySerializer
)
from collections import Counter

from rest_framework.pagination import PageNumberPagination
from datetime import datetime
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max
from .utils import get_total_tokens_owned
from users.models import PropertyOwnerProfile
from django.http import JsonResponse
from .filters import PropertyFilter
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny,BasePermission
from notifications.models import ActivityLog
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .permissions import IsAdminOrOwnerPermission, IsAdminPermission
from users.models import CustomUser


def log_activity(event_type, involved_address, contract_address=None, payload=None):
    """
    Registra un evento en el log de actividad.

    :param event_type: Tipo de evento (e.g., 'transaction', 'new_property', etc.)
    :param involved_address: Dirección involucrada en el evento.
    :param contract_address: (Opcional) Dirección del contrato involucrado.
    :param payload: (Opcional) Datos adicionales en formato JSON.
    """
    ActivityLog.objects.create(
        event_type=event_type,
        contract_address=contract_address,
        involved_address=involved_address,
        payload=payload
    )

    
class PropertyListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAdminOrOwnerPermission]


    def get(self, request):
        user_role = getattr(request, 'user_role', None)
        user_id = request.user.id
        
        if user_role == 'admin':
            properties = Property.objects.all()

        elif user_role == 'owner':
            try:
                profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            except PropertyOwnerProfile.DoesNotExist:
                return Response({'error': 'Profile not found'}, status=404)

            # Get all properties owned by the owner
            properties = Property.objects.filter(owner_profile=profile.id)
        else:
            return Response({'error': 'Unauthorized'}, status=401)

        # Filter published properties for total price calculation
        published_properties = properties.filter(status='published')

        # Calculate the total price of published properties
        total_price = published_properties.aggregate(total_price=Sum('price'))['total_price'] or 0

        # Prepare the response data
        properties_data = []
        for property_instance in properties:
            # Get metrics associated with each property
            metrics = PropertyMetrics.objects.filter(property=property_instance)
            metrics_data = PropertyMetricsSerializer(metrics, many=True).data  # Serialize the metrics
            
            # Serialize the property data
            property_data = PropertySerializerList(property_instance).data
            property_data['metrics'] = metrics_data  # Add metrics to the property data
            
            properties_data.append(property_data)  # Collect all properties with metrics

        return Response({
            'total_value_tokenized': total_price,
            'properties': properties_data  # Include properties with metrics
        })



class PropertyStatusUpdateView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAdminPermission]  # Adjust if other permissions are needed.

    def put(self, request, propertyId):
        # Retrieve property instance and new status data
        property_instance = get_object_or_404(Property, id=propertyId)
        new_status = request.data.get('status')
        rejection_reason = request.data.get('rejectionReason')
        rejection_reason_comment = request.data.get('rejectionDescription')
        
        # If status is rejected, ensure rejection reason is provided
        if new_status == 'rejected' and not rejection_reason:
            return Response(
                {'error': 'Rejection reason must be provided when status is rejected.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set rejection fields in request data if needed
        update_data = {
            'status': new_status,
            'rejection_reason': rejection_reason if new_status == 'rejected' else None,
            'rejection_reason_comment': rejection_reason_comment if new_status == 'rejected' else None,
        }
        
        # Use a serializer to validate and update the property
        serializer = UpdatePropertyStatusSerializer(property_instance, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Create a rejection notification if needed
            if new_status == 'rejected':
                self._create_rejection_notification(property_instance)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _create_rejection_notification(self, property_instance):
        """
        Create a notification for the property owner if the property is rejected.
        """
        owner_profile = property_instance.owner_profile
        message = f"Your property '{property_instance.title}' has been rejected. Check status on the dashboard."
        
        # Directly create the notification object to save overhead from using the serializer
        Notification.objects.create(
            user=owner_profile.user_id, 
            message=message,
            notification_type='admin_broadcast'
        )


class PublicPropertyList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        properties = Property.objects.exclude(status="under_review")        
        serializer = PropertySerializerList(properties, many=True)        
        return Response(serializer.data)
    
    
class ConditionalPermissionMixin:
    def get_permissions(self):
        view_type = self.request.query_params.get('view', 'overview')
        if view_type == 'overview' or view_type == 'images' or view_type == 'financial':
            return [AllowAny()]
        return [IsAuthenticated()]

# class PropertyDetailView(ConditionalPermissionMixin, APIView):
#     authentication_classes = [Auth0JWTAuthentication]
#     permission_classes=[AllowAny]
    
#     def get(self, request, pk):
#         try:
#             property = Property.objects.get(pk=pk)
#         except Property.DoesNotExist:
#             return Response({'detail': 'Property not found'}, status=404)
        
#         view_type = request.query_params.get('view', 'overview')
        
#         if view_type == 'overview':
#             serializer = PropertyOverviewSerializer(property)
#         elif view_type == 'images':
#             serializer = PropertyImagesSerializer(property)
#         elif view_type == 'financial':
#             serializer = PropertyFinancialsSerializer(property)
#         elif view_type == 'all':
#             serializer = AllDetailsPropertySerializer(property)
#         elif view_type == 'activity':
#             serializer = PropertyFinancialsSerializer(property)
#         elif view_type == 'payment':
#             property_serializer = PropertyTokenPaymentSerializer(property)
#             financials_serializer = PropertyFinancialsSerializer(property)
            
#             data = property_serializer.data
#             data['financials_details'] = financials_serializer.data

#             return Response(data)
#         else:
#             return Response({'detail': 'Invalid view type'}, status=400)
        
#         return Response(serializer.data)


class PropertyDetailLandingPage(ConditionalPermissionMixin,APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes=[AllowAny]

    def get(self, request, pk):
        
        try:
            property = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response({'detail': 'Property not found'}, status=404)
        
        view_type = request.query_params.get('view', 'overview')
        
        if view_type == 'overview':
            serializer = PropertyOverviewSerializer(property)
        elif view_type == 'images':
            serializer = PropertyImagesSerializer(property)
        elif view_type == 'financial':
            serializer = PropertyFinancialsSerializer(property)
        elif view_type == 'all':
            serializer = AllDetailsPropertySerializer(property)
        elif view_type == 'activity':
            serializer = PropertyFinancialsSerializer(property)
        elif view_type == 'payment':
            property_serializer = PropertyTokenPaymentSerializer(property)
            financials_serializer = PropertyFinancialsSerializer(property)
            
            data = property_serializer.data
            data['financials_details'] = financials_serializer.data

            return Response(data)
        else:
            return Response({'detail': 'Invalid view type'}, status=400)
        
        return Response(serializer.data)



class PropertyFilterView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializerList
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PropertyFilter


class PropertyCreateUpdateView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create_property_with_metrics(self, property_instance):
        # Generate random data for the last year
        start_date = date.today() - timedelta(days=365)
        for i in range(12):  # Generate data for each month
            metrics_date = start_date + timedelta(days=i * 30)  # Assuming months of 30 days
            PropertyMetrics.objects.create(
                property=property_instance,
                date=metrics_date,
                tenant_turnover=random.uniform(5.0, 15.0),  # Random turnover between 5% and 15%
                vacancy_rate=random.uniform(1.0, 10.0),  # Random vacancy rate between 1% and 10%
                average_yield=random.uniform(3.0, 7.0),  # Random average yield between 3% and 7%
                net_asset_value=random.uniform(100000, 500000)  # Random net asset value
            )

    def post(self, request):
        data = request.data
        user_id = request.user.id
        try:
            owner_profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            print(f"Owner Profile found: ID {owner_profile.id} for user ID {user_id}")
        except PropertyOwnerProfile.DoesNotExist:
            return Response({'error': f'Owner profile not found for user ID {user_id}.'}, status=404)
        
        data['owner_profile'] = owner_profile.id
        
        serializer = CreatePropertySerializer(data=data, context={'request': request})
        if serializer.is_valid():
            if 'owner' in request.user.rol:

                # Create the property instance using the serializer
                property_instance = serializer.save(owner_fields_completed=True)

                # Generate metrics for the created property
                self.create_property_with_metrics(property_instance)

                property_serializer = PropertySerializerList(property_instance)

                log_activity(
                    event_type='new_property',
                    involved_address=request.user.email,
                    # contract_address=selected_token.token_contract_address,  # O lo que aplique
                    payload={
                        'property_id': property_instance.id,
                    }
                )

                return Response({
                    'message': 'Property data saved successfully. Awaiting admin review.',
                    'property': property_serializer.data  # Include the property in the response
                }, status=200)

            return Response({'error': 'Only owners can create properties.'}, status=403)

        return Response(serializer.errors, status=400)

    def put(self, request):
        data = request.data
        user_id = request.user.id
        property_id = data.get('id')
        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found.'}, status=404)

        if 'admin' in request.user.rol:
            serializer = CreatePropertySerializer(property_instance, data=data, partial=True, context={'request': request})

            if serializer.is_valid():
                for field in serializer.validated_data:
                    setattr(property_instance, field, serializer.validated_data[field])
                property_instance.admin_fields_completed = True
                property_instance.save()

                return Response({'message': 'Property updated successfully by admin.'}, status=200)

            return Response(serializer.errors, status=400)

        # Si el usuario es propietario (owner)
        elif 'owner' in request.user.rol:
            try:
                owner_profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            except PropertyOwnerProfile.DoesNotExist:
                return Response({'error': 'Owner profile is required for owners to update properties.'}, status=404)
            if property_instance.owner_profile != owner_profile:
                return Response({'error': 'You can only update your own properties.'}, status=403)
            data['owner_profile'] = owner_profile.id
            if property_instance.admin_fields_completed:
                return Response({'error': 'Admin fields are already completed. No further changes allowed.'}, status=400)
            serializer = CreatePropertySerializer(property_instance,  data=data, partial=True, context={'request': request})

            if serializer.is_valid():

                for field in serializer.validated_data:
                    setattr(property_instance, field, serializer.validated_data[field])
                property_instance.owner_fields_completed = True  # Se puede ajustar según la lógica que quieras aplicar
                property_instance.save()

                return Response({'message': 'Property updated successfully by owner.'}, status=200)

            return Response(serializer.errors, status=400)

        return Response({'error': 'Only admins or owners can update properties.'}, status=403)


class TokenListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TokenSerializer 

    def get(self, request):
        tokens = Token.objects.all()  # Ejemplo de obtener datos
        serializer = self.serializer_class(tokens, many=True)  # Serializamos los datos
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Aquí validamos y procesamos los datos enviados en la solicitud POST
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda el nuevo token si los datos son válidos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionListview(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get(self, request):
        user_id = request.user.id
        
        # Get user's transactions
        transactions = Transaction.objects.filter(transaction_owner_code=user_id)
        transaction_serializer = TransactionSerializer(transactions, many=True)

        # Try to get the user's wallet
        wallet = Wallet.objects.filter(wallet_user_id=user_id).first()  # Use .first() to avoid exception
        wallet_data = None
        balance_data = None

        if wallet is not None:
            wallet_serializer = WalletSerializer(wallet)
            wallet_data = wallet_serializer.data

            # Fetch the balance for the wallet
            balance_data = self.get_wallet_balance(wallet.wallet_id)  # Adjust according to your Wallet model field
        else:
            wallet_data = {"message": "No wallet found for this user. You may create one."}

        response_data = {
            "transactions": transaction_serializer.data,
            "wallet": wallet_data,
            "balance": balance_data  # Balance will be None if wallet doesn't exist
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def get_wallet_balance(self, wallet_id):
        """Retrieve wallet balance from Circle API."""
        url = f"https://api.circle.com/v1/w3s/wallets/{wallet_id}/balances"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.CIRCLE_API_KEY}"  # Use the API key from settings
        }


        try:
            response = requests.get(url, headers=headers)
            # Check if the request was successful
            if response.status_code == 200:
                return response.json()  # Return the JSON response directly
            else:
                return {"error": response.status_code, "message": response.text}  # Return error details
        except requests.exceptions.RequestException as e:
            return {"error": "Request failed", "details": str(e)}  # Handle request exceptions

    
    def post(self, request):
        # Obtener el monto de la inversión y el id de la propiedad
        investment_amount = float(request.data["investmentAmount"])
        property_id = request.data["property_id"]

        # Validar que se haya proporcionado un ID de propiedad
        if not property_id:
            return Response({'error': 'Property ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Limitar la inversión a un máximo de 10,000
        if investment_amount > 10000: 
            return Response({
                'error': 'You cannot invest more than 10000 units. If you need further information, please contact us, thank you.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la instancia de la propiedad
        property_instance = get_object_or_404(Property, id=property_id)
        tokens_property = property_instance.tokens.all()

        # Verificar si la propiedad tiene tokens asociados
        if tokens_property.exists():
            selected_token = tokens_property.first()
        else:
            return Response({'error': 'No tokens found for this property'}, status=status.HTTP_404_NOT_FOUND)

        # Calcular la cantidad de tokens que puede comprar con la inversión
        token_price = selected_token.token_price
        tokens_amount = investment_amount / token_price

        # Verificar si hay suficientes tokens disponibles
        if selected_token.tokens_available < tokens_amount:
            return Response({'error': 'Not enough tokens available'}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el precio total de los tokens comprados (sería el mismo investment_amount en este caso)
        total_token_price = tokens_amount * token_price
   
        # Reducir los tokens disponibles
        selected_token.tokens_available -= tokens_amount
        selected_token.save()

        # Crear la transacción
        transaction = Transaction.objects.create(
            property_id=property_instance,
            transaction_owner_code=request.user,
            transaction_tokens_amount=tokens_amount,
            transaction_amount=total_token_price,
            token_code=selected_token,
            event=Transaction.Event.BUY
        )

        # Registrar o actualizar el PropertyToken
        property_token, created = PropertyToken.objects.get_or_create(
            property_code=property_instance,
            token_code=selected_token,
            owner_user_code=request.user,
            defaults={'number_of_tokens': tokens_amount}
        )

        # Si el PropertyToken ya existía, actualizar el número de tokens
        if not created:
            property_token.number_of_tokens += tokens_amount
            property_token.save()
        
        log_activity(
            event_type='transaction',
            involved_address=request.user.email,
            # contract_address=selected_token.token_contract_address,  # O lo que aplique
            payload={
                'transaction_id': transaction.id,
                'property_id': property_instance.id,
                'amount_invested': investment_amount,
                'tokens_purchased': tokens_amount,
            }
        )


        return Response({'message': 'Transaction completed successfully'}, status=status.HTTP_201_CREATED)


class SinglePropertyTransactionListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get(self,request,property_id):
        user_id = request.user.id
        
        # Filtrar transacciones por usuario y propiedad
        transactions = Transaction.objects.filter(
            transaction_owner_code=user_id, 
            property_id=property_id
        )
        
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PublicSinglePropertyTransactionListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    def get(self,request,property_id):        
        # Filtrar  propiedad
        transactions = Transaction.objects.filter(property_id=property_id)        
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class InvestedProperties(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = InvestedPropertiesSerialier

    def get(self, request):
        user_id = request.user.id
        
        properties = Property.objects.filter(transactions__transaction_owner_code_id=user_id).distinct()

        serializer = self.serializer_class(properties, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


stripe.api_key = 'sk_test_51Q2roYRqFZlL52ejF4l87u8oFLtm9lyKtUFmNYbeA04DX7aTv3YD1tbSkrQizCqtS5UWWE5RRXbcMdTN9fmU7VMa00MP5yTPjw'

YOUR_DOMAIN = 'http://localhost:3000'

@csrf_exempt  # Solo si estás usando el método POST y no tienes un CSRF token
def create_checkout_session(request):
    if request.method == 'POST':
        try:
            session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': '{{PRICE_ID}}',  # Cambia {{PRICE_ID}} por el ID del precio de tu producto
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=YOUR_DOMAIN + '/success',
                cancel_url=YOUR_DOMAIN + '/cancel',
                payment_method_types=['card'],
            )
            return JsonResponse({'clientSecret': session.id})  # Usa session.id para el clientSecret
        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def session_status(request):
    if request.method == 'GET':
        session_id = request.GET.get('session_id')
        session = stripe.checkout.Session.retrieve(session_id)
        return JsonResponse({
            'status': session.status,
            'customer_email': session.customer_details.email,
        })

    return JsonResponse({'error': 'Invalid request'}, status=400)


class PropertyUpdateListView(APIView):
    authentication_classes=[Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyUpdatesSerializer
    
    def post(self,request):
        data = request.data
        required_data = ["property_id", "update_title", "update_type", ]
        for info in required_data:
            if info not in data:
                return Response({"Error": f"{info} shoud be in the body of the request"}, status=status.HTTP_400_BAD_REQUEST)
        
        property_id = data.get("property_id")
        try:
            selected_property = Property.objects.get(id=property_id)
            update_serializer = self.serializer_class() 
        except Property.DoesNotExist:
            return Response({"Error": "The property does not exists"})
        
        property_update_data = {
            "property": selected_property,
            "update_title": data.get("updaxte_title"),  # Cambiar "updateTitle" a "update_title"
            "update_type": data.get("update_type"),    # Cambiar "updateType" a "update_type"
            "update_cost": data.get("update_cost"),     # Este campo puede ser nulo
            "update_attachments": data.get("update_attachments", []),  # Inicializa con una lista vacía si es None
        }
        update_serializer = self.serializer_class(data=property_update_data)
        if update_serializer.is_valid():
            update_serializer.save()
            return Response(update_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

#VIEW IMPROVED MARKETPLACE LIST VIEW PROPERTY
class MarketplaceListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = MarketplaceListViewSerializer

    def get(self,request):
        ids = [64,65,66]
        properties = Property.objects.filter(pk__in=ids).exclude(status__in=["under_review", "rejected"])
        serializer = self.serializer_class(properties, many=True)
        return Response(serializer.data)

class PublicPropertyList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        properties = Property.objects.exclude(status="under_review")        
        serializer = PropertySerializerList(properties, many=True)        
        return Response(serializer.data)
    
#ADMIN DASHBOARD VIEWS 
    #PROPERTY MANAGMENT VIEW
    
class PropertyManagmentListView(APIView):
    authentication_classes=[Auth0JWTAuthentication]
    permission_classes=[IsAdminPermission]

    def get(self, request):
        try:
            properties = Property.objects.all()
            serializer = AdminPropertyManagment(properties, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Property.DoesNotExist:
            return Response(
                {"error": "No properties found"},
                status=status.HTTP_404_NOT_FOUND
            )  
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    
    
    #ADMIN OVERVIEW API

class AdminOverviewListView(APIView):
    authentication_classes=[Auth0JWTAuthentication]
    permission_classes=[IsAdminPermission]

    def get(self,request):
        try:
            current_month = datetime.now().month

            # Calcular las propiedades publicadas por mes
            published_properties = Property.objects.annotate(month=TruncMonth('created_at')) \
            .filter(status = "published") \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

            # Crear el diccionario de propiedades por mes
            monthly_counts = defaultdict(int)
            for entry in published_properties:
                # Extraemos el año y mes
                month_key = entry['month'].strftime('%Y-%m')  # 'YYYY-MM'
                monthly_counts[month_key] = entry['count']

            # Meses en inglés
            months = list(calendar.month_name)[1:]  # ['January', 'February', ..., 'December']

            # Crear el formato deseado para chartData
            chart_data = []
            for i, month_name in enumerate(months):
                # Solo incluir meses hasta el mes actual
                if i+1 <= current_month:
                    month_key = f"2024-{str(i+1).zfill(2)}"  # Formato '2024-MM'
                    chart_data.append({
                        'month': month_name,
                        'properties': monthly_counts.get(month_key, 0)  # Si no hay datos, asignamos 0
                    })


            under_review = Property.objects.filter(status = "under_review")
            published_properties_amount = Property.objects.filter(status = "published").count()
            serializer = AdminOverviewSerializer(under_review, many=True)

            return Response({
                "published_properties" : published_properties_amount,
                "UR_properties": serializer.data,
                'published_properties_per_month': chart_data
            }, status=status.HTTP_200_OK)
      
        except Property.DoesNotExist:
            return Response(
                {"error": "No properties found"},
                status=status.HTTP_404_NOT_FOUND
            )  
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 


#INVESTOR OVERVIEW 

class UserInvestmentSummaryAPIView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentOverviewSerializer

    def get(self, request):
        user_id = request.user.id
        user = request.user

        total_tokens_owned = get_total_tokens_owned(user)

        # Obtener propiedades del usuario
        properties = Property.objects.filter(transactions__transaction_owner_code_id=user_id).distinct()
        # Contamos las propiedades por 'location' y 'property_type'
        locations = [property.location for property in properties]
        property_types = [property.property_type for property in properties]
        location_count = dict(Counter(locations))
        property_type_count = dict(Counter(property_types))
        
        total_properties = len(properties)

        # Serializar propiedades
        predefined_colors = ["#299D90", "#C3DF6D", "#667085", "#EAFBBE", "#D0D5DD", "#83A621", "#C8E870", "#A6F4C5", "#FFFAEA"]

            # Aseguramos que la cantidad de colores no sea mayor que los datos
        location_data = [
            {
                'item': location,
                'percentage': round((count / total_properties) * 100),
                'fill': predefined_colors[i % len(predefined_colors)]  # Asigna un color, reciclándolo si hay más ubicaciones que colores
            }
            for i, (location, count) in enumerate(location_count.items())
        ]

        # Añadimos el color también para property_type_data
        property_type_data = [
            {
                'item': property_type,
                'percentage': round((count / total_properties) * 100),
                'fill': predefined_colors[i % len(predefined_colors)]  # Asigna un color, reciclándolo si hay más tipos de propiedades que colores
            }
            for i, (property_type, count) in enumerate(property_type_count.items())
        ]

        # Serializar propiedades
        properties_data = self.serializer_class(properties, many=True).data

        # Preparar los datos para la respuesta
        data = {
            'total_tokens_owned': total_tokens_owned,
            'locations': location_data,  # Incluye las localidades con porcentajes
            'property_types': property_type_data,  # Incluye los tipos de propiedad con porcentajes
            'properties': properties_data,  # Incluye las propiedades serializadas
        }

        return Response(data, status=status.HTTP_200_OK)






#INVESTOR ASSETS 

class InvestorAssetsGetView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = InvestorAssetsSerializer

    def get(self, request):
        user_id = request.user.id
        user = request.user 
        
        properties = Property.objects.filter(transactions__transaction_owner_code_id=user_id).distinct()
        property_types = [property.property_type for property in properties]
        property_type_count = dict(Counter(property_types))
        total_properties = len(properties)
        predefined_colors = ["#299D90", "#C3DF6D", "#667085", "#EAFBBE", "#D0D5DD", "#83A621", "#C8E870", "#A6F4C5", "#FFFAEA"]
        property_type_data = [
            {
                'item': property_type,
                'percentage': round((count / total_properties) * 100),
                'fill': predefined_colors[i % len(predefined_colors)]  # Asigna un color, reciclándolo si hay más tipos de propiedades que colores
            }
            for i, (property_type, count) in enumerate(property_type_count.items())
        ]

        serializer = self.serializer_class(properties, many=True, context={'request': request, 'user': user})
        data = {
            'property_types': property_type_data,  
            'properties': serializer.data,  
        }

        return Response(data, status=status.HTTP_200_OK)
    

#INVESTOR TRADING PROPERTY DETAILS MODAL 

class InvestorTradingPropertyDetails(APIView):

    def get(self, request, referenceNumber):
        try:
            property= Property.objects.get(reference_number=referenceNumber)            
            serializer = InvestorTradingPropertySerializer(property)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Property.DoesNotExist:
            # Si no se encuentra la propiedad
            return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)
    


#BLOCKCHAIN VIEWS

#GET THE BLOCKHAIN ADDRESS OF A SPECIFIC PROPERTY

class PropertySmartContract(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, referenceNumber):

        try:
            selected_property = Property.objects.get(reference_number=referenceNumber)            
            data = {
                'chain_address': selected_property.property_blockchain_adress,  # remplaza 'other_field' por el campo real que quieras retornar
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Property.DoesNotExist:
            # Si no se encuentra la propiedad
            return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)
        

class PropertyTradeSellListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            user = request.user 
            sold_properties = Property.objects.filter(status='sold')
            serialzier = PropertyTradeSellSerializer(sold_properties,many=True, context={'request': request, 'user': user})
            return Response(serialzier.data, status=status.HTTP_200_OK)
        
        except Property.DoesNotExist:
            # Si no se encuentra la propiedad
            return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)
        


