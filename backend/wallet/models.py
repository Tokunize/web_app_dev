from django.db import models
from django.core.validators import RegexValidator, ValidationError
import re
import requests
from django.conf import settings


class Wallet(models.Model):
    # Validador para direcciones de Ethereum (0x seguido de 40 caracteres hexadecimales)
    wallet_address_validator = RegexValidator(
        regex=r'^0x[a-fA-F0-9]{40}$',  # Formato de dirección de Ethereum
        message="Invalid Ethereum wallet address. It must start with '0x' followed by 40 hexadecimal characters."
    )
    
    wallet_id = models.CharField(max_length=100, unique=True)  # ID único de la wallet devuelto por Circle
    wallet_address = models.CharField(max_length=42, unique=True,null=True, blank=True,  validators=[wallet_address_validator])
    wallet_user_id = models.ForeignKey("users.customuser", on_delete=models.CASCADE)
    wallet_user = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_enabled = models.BooleanField(default=False)

    balance = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)  

    def __str__(self):
        return f'Wallet {self.wallet_address} (ID: {self.wallet_id}) for user {self.wallet_user_id}'

    # Método para validar la dirección de la wallet
    def clean(self):
        if not self.is_valid_wallet_address(self.wallet_address):
            raise ValidationError('Invalid wallet address.')

    # Lógica para validar la dirección de la wallet (en caso de que quieras hacer validaciones adicionales)
    @staticmethod
    def is_valid_wallet_address(address):
        # Verifica el formato de la dirección de Ethereum
        return re.match(r'^0x[a-fA-F0-9]{40}$', address) is not None
    
    def get_balance(self):
        """
        Consulta el balance desde el proveedor externo y lo actualiza en la base de datos.
        """
        PROVIDER_TOKEN_URL = settings.PROVIDER_TOKEN_URL
        PROVIDER_CLIENT_ID = settings.PROVIDER_CLIENT_ID
        PROVIDER_CLIENT_SECRET = settings.PROVIDER_CLIENT_SECRET
        PROVIDER_USERS_VAULT = settings.PROVIDER_USERS_VAULT

        payload = {
            "clientId": PROVIDER_CLIENT_ID,
            "clientSecret": PROVIDER_CLIENT_SECRET
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        response = requests.post(PROVIDER_TOKEN_URL, json=payload, headers=headers)

        # Verificamos si la respuesta es exitosa (status code 200)
        if response.status_code == 200:
            access_token = response.json().get("accessToken")
            if access_token:
                print("access token successfully ")

        provider_balace_url = F"https://api.sandbox.palisade.co/v2/vaults/{PROVIDER_USERS_VAULT}/wallets/{self.wallet_id}/balances"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
     
        try:
            response = requests.get(provider_balace_url, headers=headers)
            if response.status_code == 200:
                balance_data = response.json()
                new_balance = balance_data["balances"][0]["balance"]
                self.balance = new_balance
                self.save()
                return new_balance
            
            else:
                raise Exception(f"Failed to fetch balance. Status code: {response.status_code}. Response: {response.text}")
        except Exception as e:
            raise Exception(f"An error occurred while updating the balance: {str(e)}")
        
    
    def enable_wallet(self):
        """
        Habilita la wallet.
        """
        self.is_enabled = True
        self.save()

