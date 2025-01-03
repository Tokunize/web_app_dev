from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from throttling import CustomAnonRateThrottle  # Asegúrate de que la ruta sea correcta
from rest_framework.throttling import UserRateThrottle
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from .models import Transaction
from rest_framework.pagination import PageNumberPagination
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .serializers import TransactionSerializer
from wallet.serializers import WalletSerializer
import requests
from notifications.models import ActivityLog
from wallet.models import Wallet
from property.models import PropertyToken

# Create your views here.

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
        balance_data = wallet.get_balance()
        response_data = {
            "transactions": transaction_serializer.data,
            "balance": balance_data  # Balance will be None if wallet doesn't exist
        }

        return Response(response_data, status=status.HTTP_200_OK)

    
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
        property_instance = get_object_or_404("property.Property", id=property_id)
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



# GET all the  Transactions for a single property for the dashboard and for a especific user
class TransactionSinglePropertyDashboard(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get(self,request,reference_number):
        user_id = request.user.id
        
        # Filtrar transacciones por usuario y propiedad
        transactions = Transaction.objects.filter(
            transaction_owner_code=user_id, 
            reference_number=reference_number
        )
        
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# GET all the  Transactions for a single property for the marketplace
class TransactionMarketplaceProperty(APIView):
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    def get(self,request,reference_number):        
        # Filtrar  propiedad
        transactions = Transaction.objects.filter(reference_number=reference_number)        
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
