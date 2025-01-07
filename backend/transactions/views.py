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
from property.models import Property

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
        
        # Obtener las transacciones del usuario
        transactions = Transaction.objects.filter(transaction_owner_code=user_id)

        # Serializar las transacciones con paginación automática aplicada por DRF
        transaction_serializer = TransactionSerializer(transactions, many=True)

        # Obtener el balance de la wallet
        wallet = request.user.wallet
        balance_data = wallet.get_balance()
        
        # Construir la respuesta con los datos
        response_data = {
            "transactions": transaction_serializer.data,
            "balance": balance_data  
        }

        return Response(response_data, status=status.HTTP_200_OK)

    
    def post(self, request,reference_number):
        # Obtener el monto de la inversión y el id de la propiedad
        invested_tokens_amount = request.data["investmentAmount"]
        
        property_instance = Property.objects.get(reference_number=reference_number)
        tokens_property = property_instance.tokens.all()
        if tokens_property.exists():
            selected_token = tokens_property.first()
        else:
            return Response({'error': 'No tokens found for this property'}, status=status.HTTP_404_NOT_FOUND)

        max_allowed_investment = selected_token.tokens_available * 0.25

        # Verificamos si la cantidad invertida supera el 25% de los tokens disponibles
        if invested_tokens_amount > max_allowed_investment:
            return Response({
                'error': f'You cannot invest more than 25% of the available tokens ({max_allowed_investment} units). If you need further information, please contact us, thank you.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Calcular la cantidad de tokens que puede comprar con la inversión
        token_price = selected_token.token_price

        # Verificar si hay suficientes tokens disponibles
        if selected_token.tokens_available < invested_tokens_amount:
            return Response({'error': 'Not enough tokens available'}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el precio total de los tokens comprados (sería el mismo invested_tokens_amount en este caso)
        total_token_price = invested_tokens_amount * token_price
   
        # Reducir los tokens disponibles
        selected_token.tokens_available -= invested_tokens_amount
        selected_token.save()

        # Crear la transacción
        transaction = Transaction.objects.create(
            property_id=property_instance,
            transaction_owner_code=request.user,
            transaction_tokens_amount=invested_tokens_amount,
            transaction_amount=total_token_price,
            token_code=selected_token,
            transaction_type=Transaction.TransactionType.BUY
        )

        print(transaction)

        # Registrar o actualizar el PropertyToken
        property_token, created = PropertyToken.objects.get_or_create(
            property_code=property_instance,
            token_code=selected_token,
            owner_user_code=request.user,
            defaults={'number_of_tokens': invested_tokens_amount}
        )

        # Si el PropertyToken ya existía, actualizar el número de tokens
        if not created:
            property_token.number_of_tokens += invested_tokens_amount
            property_token.save()
        
        # log_activity(
        #     event_type='transaction',
        #     involved_address=request.user.email,
        #     # contract_address=selected_token.token_contract_address,  # O lo que aplique

        #     payload={
        #         'transaction_id': transaction.id,
        #         'property_id': property_instance.id,
        #         'amount_invested': invested_tokens_amount,
        #         'tokens_purchased': tokens_amount,
        #     }
        # )

        return Response({'message': 'Transaction completed successfully'}, status=status.HTTP_201_CREATED)




# GET all the  Transactions for a single property for the marketplace
class TransactionMarketplaceProperty(APIView):
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    def get(self,request,reference_number):        
        # Filtrar  propiedad
        transactions = Transaction.objects.filter(reference_number=reference_number)        
        serializer = self.serializer_class(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
