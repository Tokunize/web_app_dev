from rest_framework import serializers
from .models import Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['wallet_address', 'balance', 'wallet_user_id', 'created_at', 'updated_at']  # Ensure wallet_user_id is included
        read_only_fields = ['created_at']  # Estos campos no deben ser modificados

    def validate_wallet_address(self, value):
        # Validar la dirección de la wallet
        if not Wallet.is_valid_wallet_address(value):
            raise serializers.ValidationError("Invalid Ethereum wallet address.")
        return value
