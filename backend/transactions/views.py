from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db import transaction
from django.db import models

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
from wallet.serializers import WalletDashboardSerializer
from property.models import PropertyToken
from property.models import Property
from django.views.decorators.csrf import csrf_exempt

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
    pagination_class = PageNumberPagination  

    def get(self, request):
        user_id = request.user.id
        
        # Obtener las transacciones del usuario
        transactions = Transaction.objects.filter(transaction_owner_code=user_id).select_related('transaction_owner_code')

        # Aplicar la paginación
        paginator = self.pagination_class()
        paginated_transactions = paginator.paginate_queryset(transactions, request)
        transaction_serializer = TransactionSerializer(paginated_transactions, many=True)

        # Verificar si el usuario tiene un wallet asociado
        wallet_data = None
        try:
            wallet = request.user.wallet  # Esto lanzará un error si no tiene wallet
        except Wallet.DoesNotExist:
            # Si no existe un wallet, devolver un mensaje de error personalizado
            raise NotFound(detail="No se ha encontrado un wallet para este usuario. Por favor, contacte con la plataforma para solucionarlo.")

        # Solo calcular el balance y la dirección si es la primera página
        if request.query_params.get('page') in [None, '1']:  # Si estamos en la primera página o no se especifica la página
            # Usar el serializer de Wallet, pasando 'include_balance' en el contexto para decidir si incluir el balance
            wallet_serializer = WalletDashboardSerializer(wallet, context={'include_balance': True})
            wallet_data = wallet_serializer.data

        # Construir la respuesta con las transacciones, y wallet si es la primera página
        response_data = {
            "transactions": transaction_serializer.data,
        }

        if wallet_data:
            response_data["wallet"] = wallet_data  # Agregar la data del wallet solo si se pidió

        # Responder con la paginación estándar de DRF
        return paginator.get_paginated_response(response_data)
    
    @transaction.atomic
    def post(self, request, reference_number):
        # Obtener el asset que se desea usar como colateral
        collateralized_asset_ref = request.data.get("collateralizedAsset")
        try:
            collateralized_asset_instance = Property.objects.select_related('property_owner__wallet').get(reference_number=collateralized_asset_ref)
        except Property.DoesNotExist:
            return Response({'error': 'Collateralized asset not found'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar que el usuario es el propietario del asset colateralizado
        if collateralized_asset_instance.property_owner != request.user:
            return Response({"error": "Only the owners can use the asset as collateral."}, status=status.HTTP_403_FORBIDDEN)

        # Obtener la propiedad en la que se desea invertir
        try:
            invested_property_instance = Property.objects.select_related('property_owner__wallet').prefetch_related('tokens').get(reference_number=reference_number)
        except Property.DoesNotExist:
            return Response({'error': 'Invested property not found'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar que la wallet del propietario sea diferente
        if invested_property_instance.property_owner.wallet.wallet_address == collateralized_asset_instance.property_owner.wallet.wallet_address:
            return Response({"error": "You can't collateralize into your own asset."}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la cantidad de tokens que el usuario quiere invertir
        invested_tokens_amount = request.data.get("tokensAmount")
        if not invested_tokens_amount or invested_tokens_amount <= 0:
            return Response({"error": "Invalid token amount."}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener el token asociado a la propiedad
        selected_token = invested_property_instance.tokens.first()
        if not selected_token:
            return Response({'error': 'No tokens found for this property'}, status=status.HTTP_404_NOT_FOUND)

        # Calcular el límite máximo de inversión permitido (25% del suministro inicial)
        max_allowed_investment = selected_token.initial_supply * 0.25

        # Obtener la cantidad de tokens que el usuario ya posee
        already_owned_tokens = PropertyToken.objects.filter(
            property_code=invested_property_instance,
            owner_user_code=request.user
        ).aggregate(total_tokens=models.Sum('number_of_tokens'))['total_tokens'] or 0

        # Verificar si la cantidad total de tokens supera el límite permitido
        total_added_tokens = already_owned_tokens + invested_tokens_amount
        if total_added_tokens > max_allowed_investment:
            return Response({
                "error": f"You cannot invest more than 25% of the initial supply tokens ({selected_token.initial_supply} units)."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si hay suficientes tokens disponibles
        if selected_token.tokens_available < invested_tokens_amount:
            return Response({'error': 'Not enough tokens available'}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular el precio total de los tokens
        total_token_price = invested_tokens_amount * selected_token.token_price

        # Bloquear los tokens seleccionados y guardarlos
        selected_token.lock_Tokens(invested_tokens_amount)
        selected_token.save()

        # Crear la transacción de compra
        Transaction.objects.create(
            property_id=invested_property_instance,
            transaction_owner_code=request.user,
            transaction_tokens_amount=invested_tokens_amount,
            transaction_amount=total_token_price,
            token_code=selected_token,
            transaction_type=Transaction.TransactionType.BUY
        )

        # Registrar o actualizar el PropertyToken
        PropertyToken.objects.update_or_create(
            property_code=invested_property_instance,
            token_code=selected_token,
            owner_user_code=request.user,
            defaults={'number_of_tokens': already_owned_tokens + invested_tokens_amount}
        )

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