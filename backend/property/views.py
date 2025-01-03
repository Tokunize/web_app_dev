from rest_framework.response import Response
from rest_framework import status
from throttling import CustomAnonRateThrottle  # Asegúrate de que la ruta sea correcta
from rest_framework.throttling import UserRateThrottle
from django.views.decorators.cache import cache_page
from django.db.models import Count
from collections import defaultdict
import calendar
from django.db.models.functions import TruncMonth
from django.conf import settings  # Make sure to import settings to access the API key
from django.db.models import Sum
from rest_framework.views import APIView
from property.models import Property,PropertyToken
from .serializers import (
    PropertySerializerList,
    AllDetailsPropertySerializer,
    PropertyOverviewSerializer,
    PropertyImagesSerializer, 
    CreatePropertySerializer,
    PropertyFinancialsSerializer,
    PropertyTokenPaymentSerializer,
    InvestmentOverviewSerializer,
    MarketplaceListViewSerializer,
    AdminPropertyManagment,
    AdminOverviewSerializer,
    InvestorAssetsSerializer,
    PropertyTradeSellSerializer,
    InvestorTradingPropertySerializer,
    InvestorInvestedSoldProperties,
    PropertySerializer,
    AssetToAssetSerializer
)
from collections import Counter
from django.utils.decorators import method_decorator
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
from .utils import get_total_tokens_owned
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .permissions import  IsAdminPermission,ConditionalPermissionMixin


    
class PropertyListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAdminPermission]

    def get(self, request):
        user_role = getattr(request, 'user_role', None)
        
        if user_role == 'admin':
            properties = Property.objects.all()
     
        published_properties = properties.filter(status='published')

        # Calculate the total price of published properties
        total_price = published_properties.aggregate(total_price=Sum('price'))['total_price'] or 0

        # Prepare the response data
        properties_data = []
        for property_instance in properties:            
            # Serialize the property data
            property_data = PropertySerializerList(property_instance).data
            
            properties_data.append(property_data)  # Collect all properties with metrics

        return Response({
            'total_value_tokenized': total_price,
            'properties': properties_data  # Include properties with metrics
        })

        

class PropertyCreateUpdateView(APIView):
    authentication_classes = [Auth0JWTAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            # Responder con el objeto creado y el código de estado 201
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Si los datos no son válidos, responder con un error 400 y los detalles del error
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, reference_number):
        data = request.data
        try:
            property_instance = Property.objects.get(reference_number=reference_number)
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
        return Response({'error': 'Only admins or owners can update properties.'}, status=403)



# -------------------------------------------- VIEW IMPROVED MARKETPLACE LIST VIEW PROPERTY -----------------------------------------------------






class MarketplaceListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = MarketplaceListViewSerializer
    throttle_classes = [CustomAnonRateThrottle, UserRateThrottle]

    def get(self, request):
        try:
            properties = Property.objects.filter(status="published")
            if not properties.exists():
                return Response({"detail": "No published properties found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(properties, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PropertyDetailLandingPage(ConditionalPermissionMixin,APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes=[AllowAny]
    throttle_classes = [CustomAnonRateThrottle, UserRateThrottle]

    @method_decorator(cache_page(60 * 15), name='dispatch')  # Cachea la respuesta durante 15 minutos
    def get(self, request, reference_number):
        
        try:
            property = Property.objects.get(reference_number=reference_number)
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


class AssetToAssetProperties(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [CustomAnonRateThrottle, UserRateThrottle]

    def get(self, request):
        user_id = request.user.id
        try:
            # Usamos filter en lugar de get para manejar múltiples propiedades
            all_properties = Property.objects.filter(property_owner=user_id)
            
            if not all_properties.exists():
                return Response({"detail": "No properties found for this user."}, status=status.HTTP_404_NOT_FOUND)

            # Serializa las propiedades encontradas
            serializer = AssetToAssetSerializer(all_properties, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Si ocurre un error inesperado
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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
        properties = Property.objects.filter(property_owner=user_id).distinct()
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
        
#INVESTOR TRADING ALL THE PROPERTY AN INVESTOR INVESTED

class InvestorInvestedProperties(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            user = request.user
            properties = Property.objects.filter(
                transactions__transaction_owner_code_id=user.id,
                status='sold'
            ).distinct()

            print(properties)
            serializer = InvestorInvestedSoldProperties(properties, many=True, context={'request': request, 'user': user})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        





