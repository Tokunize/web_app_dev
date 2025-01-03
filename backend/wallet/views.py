from django.shortcuts import render
import requests
from rest_framework import  status
from rest_framework.response import Response
from .models import Wallet
from .serializers import WalletSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.authentication import Auth0JWTAuthentication
import uuid
from django.conf import settings
from users.models import CustomUser
from rest_framework.views import APIView


class SaveWalletInBackend(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        user_wallets = Wallet.objects.filter(wallet_user_id=user_id)  # Filter wallets by user_id
        
        # Serialize the wallet data
        serializer = WalletSerializer(user_wallets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)  #



class AddFundsWallet(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass



class CheckWalletBalance(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    apikey = settings.CIRCLE_API_KEY  

    def get(self, request):
        user_id = request.user.id

        # Busca el wallet_id asociado al usuario
        try:
            wallet = Wallet.objects.get(wallet_user_id=user_id)
            wallet_id = wallet.wallet_id
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found for this user."}, status=404)

        # Construye la URL para la solicitud a la API
        url = f"https://api.circle.com/v1/w3s/wallets/{wallet_id}/balances"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.apikey}"  # Reemplaza con tu API key
        }

        # Realiza la solicitud a la API
        response = requests.get(url, headers=headers)

        # Verifica si la solicitud fue exitosa
        if response.status_code == 200:
            balances = response.json()  # Analiza la respuesta JSON
            return Response(balances, status=200)
        else:
            print("Error:", response.status_code, response.text)
            return Response({"error": "Failed to retrieve balances."}, status=response.status_code)





