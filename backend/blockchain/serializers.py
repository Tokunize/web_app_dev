from .models import Token
from rest_framework import serializers


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'


class TokenSerializerPayment(serializers.ModelSerializer):
    tokens_sold = serializers.SerializerMethodField()

    class Meta():
        model = Token 
        fields = ['token_price','tokens_available','total_tokens','tokens_sold']
    
    def get_tokens_sold(self, obj):
        return obj.tokens_sold_percentage()  