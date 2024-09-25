from django.shortcuts import render
import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Wallet
from .serializers import WalletSerializer
from rest_framework.permissions import IsAuthenticated
from users.authentication import Auth0JWTAuthentication

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    apikey = "TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a"
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = request.user.id 
        payload = {
            "userId": str(user_id)  # Asegúrate de que el userId coincida con el que Circle espera
        }

        # Headers para la solicitud a la API de Circle
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.apikey}"
        }

        # Crear la wallet en Circle
        url = "https://api.circle.com/v1/w3s/users"
        response = requests.post(url, json=payload, headers=headers)

        # Verifica si la creación fue exitosa
        if response.status_code != 200:
            return Response({"detail": "Failed to create wallet in Circle."}, status=status.HTTP_400_BAD_REQUEST)

        # Aquí podrías manejar la respuesta de Circle y guardar la información en tu base de datos
        circle_data = response.json()
        wallet_id = circle_data['data']['id']  # Suponiendo que la respuesta tiene este formato
        wallet_address = "0x" + wallet_id[-40:]  # Esto es solo un ejemplo, ajusta según tus necesidades

        # Serializar la wallet creada
        serializer = self.get_serializer(data={
            'wallet_id': wallet_id,
            'wallet_address': wallet_address,
            'wallet_user_id': request.user.id,
            'balance': 0,  # Inicializar balance a 0 o con el valor correspondiente
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
