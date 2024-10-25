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
from users.models import CustomUser
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

            # Preparar el payload para la creación de la wallet -----------------------------
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
        verify_user_id = request.user.id  # Get authenticated user's ID

        try:
            payload = request.data
            user_id_from_payload = payload.get('user_id')
            print(user_id_from_payload, "usuario aqui ")
            # Circle API URL with the provided user ID
            get_wallet_url = f"https://api.circle.com/v1/w3s/wallets?userId={user_id_from_payload}"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {apikey}"
            }

            # Make the GET request to Circle API
            response = requests.get(get_wallet_url, headers=headers)
            response_data = response.json()

            # Debug the full response
            # print(f"Circle API Response: {response_data}")

            wallets = response_data.get("data", {}).get("wallets", [])
            print(f"Wallets: {wallets}")
            
            # Handle case where no wallets are returned
            if not wallets:
                return Response({"detail": "No wallets found for the given user."}, status=status.HTTP_400_BAD_REQUEST)

            # Extract wallet details
            wallet_details = wallets[0]
            wallet_id = wallet_details.get("id")
            print(wallet_id)
            wallet_address = wallet_details.get("address")
            print(wallet_address)


            # Prepare the wallet data to be saved
            wallet_data = {
                'wallet_id': wallet_id,
                'wallet_address': wallet_address,
                'wallet_user_id': verify_user_id  # Associating the wallet with the authenticated user
            }
        
            print("esto es lo que envuii", wallet_data)

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
        



class AddFundsWallet(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.id
        amount_fund = request.data.get('fundAmount')  # Using get() to avoid KeyError
        print(amount_fund,"----------------------")
        
        # Get the API key from settings
        api_key = settings.CIRCLE_API_KEY

        # Check if the API key is configured
        if not api_key:
            return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Get the user's wallet
            wallet = Wallet.objects.get(wallet_user_id=user_id)
            wallet_address = wallet.wallet_address
        except Wallet.DoesNotExist:
            return Response({"error": "No wallet found for this user"}, status=status.HTTP_404_NOT_FOUND)

        url = "https://api.circle.com/v1/faucet/drips"

        # Payload for the Circle API
        payload = {
            "address": wallet_address,
            "blockchain": "ETH-SEPOLIA",
            "native": False,
            "usdc": True,
            "eurc": False,
            "amount": amount_fund  
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        try:
            response = requests.post(url, json=payload, headers=headers)

            # Log the response status code and text for debugging
            print(f"Response Status Code: {response.status_code}")
            print(f"Response Text: {response.text}")

            # Check if the response was successful
            if response.status_code not in (200, 201):
                # Try to decode the response as JSON; if it fails, use the text
                try:
                    response_data = response.json()
                    print(response_data)
                except ValueError:  # JSON decoding error
                    response_data = {"error": "Invalid response", "details": response.text}
                return Response(response_data, status=response.status_code)

            # Successful response
            response_data = response.json()
            return Response(response_data, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CheckWalletBalance(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    apikey = settings.CIRCLE_API_KEY  # Asumiendo que usas settings para tu configuración

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



class CreateTransfersCircle(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print("eeeeyyyyyyyy")
        print(request.user.id)
        # Definir URL para crear el user token
        token_url = "https://api.circle.com/v1/w3s/users/token"

        # Encabezados para la solicitud de creación de token
        headers = {
            "Authorization": "Bearer TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a",
            "Content-Type": "application/json"
        }
        payload = {
            "userId":"investor_01"
        }

        # Realizar la solicitud para obtener el user token
        token_response = requests.post(token_url,json=payload, headers=headers)

        if token_response.status_code == 200 :
            received_data = token_response.json()
            user_token = received_data.get("data", {}).get("userToken")
            encryption_key = received_data.get("data", {}).get("encryptionKey")

            # Comprobar que se ha recibido el token
            if not user_token or not encryption_key:
                return Response({"error": "User token or encryption key not found."}, status=400)

            idempotency_key = str(uuid.uuid4())  # UUID con guiones, formato estándar
            print(idempotency_key)

            # Crear transferencia usando el user token
            transfer_url = "https://api.circle.com/v1/w3s/user/transactions/transfer"
            payload = {
                "idempotencyKey": idempotency_key,  # Cambia por un valor único
                "destinationAddress": "0x2F2E692f867DBb38e2F5d75629D2BE2a26fC9AFd",
                "feeLevel": "LOW",
                "tokenId": "5797fbd6-3795-519d-84ca-ec4c5f80c3b1",
                "walletId": "8a764844-b75c-50b5-9479-cf9e1275329c",
                "amounts": ["1"]
            }

            transfer_headers = {
                "X-User-Token": user_token,  # Usar el user_token obtenido
                "Authorization": f"Bearer {settings.CIRCLE_API_KEY}",  # Asumiendo que usas un settings para tu API Key
                "Content-Type": "application/json"
            }

            # Realizar la solicitud para crear la transferencia
            transfer_response = requests.post(transfer_url, json=payload, headers=transfer_headers)

            if transfer_response.status_code == 201:
                transfer_data = transfer_response.json()
                challenge_id = transfer_data.get("data", {}).get("challengeId")  # Obtener el challengeId
                return Response({"challengeId": challenge_id , "userToken":user_token , "encryptionKey": encryption_key}, status=200)
            else:
                return Response({"error": "Failed to create transfer.", "details": transfer_response.text}, status=transfer_response.status_code)

        else:
            return Response({"error": "Failed to retrieve user token.", "details": token_response.text}, status=token_response.status_code)


