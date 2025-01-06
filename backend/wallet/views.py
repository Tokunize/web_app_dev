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

    def get(self, request):
        pass