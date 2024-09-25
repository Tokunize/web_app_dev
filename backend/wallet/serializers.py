from rest_framework import serializers
from .models import Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['wallet_id', 'wallet_address', 'wallet_user_id', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['wallet_id', 'created_at', 'updated_at']  # Estos campos no deben ser modificados

    def validate_wallet_address(self, value):
        # Validar la dirección de la wallet
        if not Wallet.is_valid_wallet_address(value):
            raise serializers.ValidationError("Invalid Ethereum wallet address.")
        return value
