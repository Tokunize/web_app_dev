from django.shortcuts import render
import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Wallet
from .serializers import WalletSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.authentication import Auth0JWTAuthentication
from decouple import config
import uuid
from django.conf import settings
from rest_framework.views import APIView


class CreateWalletAPIView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]  # Cambiado a IsAuthenticated
        
    apikey = settings.CIRCLE_API_KEY  # Asumiendo que usas settings para tu configuración
    
    def post(self, request, *args, **kwargs):
        user_id = request.user.id  


        try:
                     
            if not user_id:
                return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

            unique_uuid = str(uuid.uuid4()).replace("-", "")[:7]  # Elimina los guiones y toma los primeros 7 caracteres
            combined_user_id = f"{unique_uuid}{user_id}"  # Asegúrate de que el user_id sea una cadena

            print(combined_user_id)

            # Preparar el payload para la creación de la wallet
            payload = {
                "userId": str(combined_user_id)  # Se asegura que el userId coincida con lo que Circle espera
            }

            # Encabezados para la solicitud a la API de Circle
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.apikey}"
            }

            # URL para crear la wallet en Circle
            create_wallet_url = "https://api.circle.com/v1/w3s/users"

            # Realiza la solicitud POST para crear la wallet
            response = requests.post(create_wallet_url, json=payload, headers=headers)
            
            print(response.text)
            print(f"Response Status Code: {response.status_code}")

            # Verifica si la creación fue exitosa
            if response.status_code != 201:
                return Response({"detail": f"Failed to create wallet in Circle: {response.text}"}, status=status.HTTP_400_BAD_REQUEST)

            # Maneja la respuesta de Circle y extrae el 'user_id'
            circle_data = response.json()
            user_id = circle_data.get('data', {}).get('id')  # Usa .get() para evitar errores si 'data' o 'id' no existen

            # Si no se encontró 'user_id', responde con un error
            if not user_id:
                return Response({"detail": "Failed to retrieve user ID from Circle response."}, status=status.HTTP_400_BAD_REQUEST)

            # Iniciar sesión para el account usando el 'user_id' recién creado
            try:
                # URL para generar el token de usuario en Circle
                token_url = "https://api.circle.com/v1/w3s/users/token"
                
                # Usa el user_id recuperado dinámicamente
                token_payload = {
                    "userId": user_id  
                }
                token_headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.apikey}"
                }

                # Realiza la solicitud POST para generar el token de sesión
                token_response = requests.post(token_url, json=token_payload, headers=token_headers)

                # Verifica si la solicitud de token fue exitosa
                if response.status_code not in (200, 201):  # Acepta tanto 200 como 201
                    return Response({"detail": f"Failed to create session token in Circle: {token_response.text}"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Extraer el 'userToken' de la respuesta de token
                circle_token_data = token_response.json()
                user_token = circle_token_data.get('data', {}).get('userToken')
                encryption_key = circle_token_data.get('data', {}).get('encryptionKey')
                if not user_token:
                    return Response({"detail": "Failed to retrieve user token from Circle response."}, status=status.HTTP_400_BAD_REQUEST)

                # URL para inicializar el usuario en Circle con la blockchain especificada
                initialize_url = "https://api.circle.com/v1/w3s/user/initialize"
                
                # Generar un UUID aleatorio para 'idempotency_key'
                idempotency_key = str(uuid.uuid4())
                blockchain = "ETH-SEPOLIA"  # Blockchain que estás inicializando

                # Payload para la solicitud de inicialización
                initialize_payload = {
                    "idempotencyKey": idempotency_key,
                    "blockchains": [blockchain]
                }

                # Encabezados para la solicitud de inicialización
                initialize_headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.apikey}",
                    "X-User-Token": user_token
                }

                # Realiza la solicitud POST para inicializar el usuario en la blockchain
                initialize_response = requests.post(initialize_url, json=initialize_payload, headers=initialize_headers)
                
                if initialize_response.status_code not in (200, 201):
                    return Response({"detail": f"Failed to initialize user in Circle: {initialize_response.text}"}, status=status.HTTP_400_BAD_REQUEST)

                # Extract challengeId from the response
                initialize_data = initialize_response.json()
                challenge_id = initialize_data.get('data', {}).get('challengeId')

                # Return the response with user_token, encryption_key, and challengeId
                return Response({
                    "detail": "Wallet created and session initialized successfully.",
                    "userToken": user_token,
                    "encryptionKey": encryption_key,
                    "challengeId": challenge_id,
                    "user_id": combined_user_id
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"detail": f"An error occurred during session initialization: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"detail": f"An error occurred during wallet creation: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class SaveWalletInBackend(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        user_wallets = Wallet.objects.filter(wallet_user_id=user_id)  # Filter wallets by user_id
        
        # Serialize the wallet data
        serializer = WalletSerializer(user_wallets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)  #


    def post(self, request):
        apikey = settings.CIRCLE_API_KEY  # Get Circle API key from settings
        user_id = request.user.id  # Get authenticated user's ID

        try:
            payload = request.data
            user_id_from_payload = payload.get('user_id')
            # Circle API URL with the provided user ID
            get_wallet_url = f"https://api.circle.com/v1/w3s/wallets?userId={user_id_from_payload}"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {apikey}"  # Ensure the API key is correct and properly formatted
            }

            # Make the GET request to Circle API
            response = requests.get(get_wallet_url, headers=headers)
            response_data = response.json()

            # Debug the full response
            print(f"Circle API Response: {response_data}")

            wallets = response_data.get("data", {}).get("wallets", [])
            print(f"Wallets: {wallets}")
            
            # Handle case where no wallets are returned
            if not wallets:
                return Response({"detail": "No wallets found for the given user."}, status=status.HTTP_400_BAD_REQUEST)

            # Extract wallet details
            wallet_details = wallets[0]
            wallet_id = wallet_details.get("id")
            wallet_address = wallet_details.get("address")

            # Prepare the wallet data to be saved
            wallet_data = {
                'wallet_id': wallet_id,
                'wallet_address': wallet_address,
                'wallet_user_id': user_id  # Associating the wallet with the authenticated user
            }

            # Serialize and save the wallet data
            serializer = WalletSerializer(data=wallet_data)
            if serializer.is_valid():
                serializer.save()
                return Response({"detail": "Wallet saved successfully."}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle the exception and return an error response
            return Response({"detail": f"An error occurred during saving the wallet in the backend: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
