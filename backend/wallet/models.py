from django.db import models
from django.core.validators import RegexValidator, ValidationError
import re

class Wallet(models.Model):
    # Validador para direcciones de Ethereum (0x seguido de 40 caracteres hexadecimales)
    wallet_address_validator = RegexValidator(
        regex=r'^0x[a-fA-F0-9]{40}$',  # Formato de dirección de Ethereum
        message="Invalid Ethereum wallet address. It must start with '0x' followed by 40 hexadecimal characters."
    )
    
    wallet_id = models.CharField(max_length=100, unique=True)  # ID único de la wallet devuelto por Circle
    wallet_address = models.CharField(max_length=42, unique=True, validators=[wallet_address_validator])
    wallet_user_id = models.ForeignKey("users.customuser", on_delete=models.CASCADE)
    wallet_user = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
