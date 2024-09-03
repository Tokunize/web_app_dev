from rest_framework import serializers
from property.models import Property,TokensTransaction


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id','title', 'location', 'image', 'token_price','active', 'total_tokens','tokensSold',  'projected_annual_return','property_type', "created_at"]

class PropertyImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ["image", 'video_urls']

class PropertyOverviewSerializer(serializers.ModelSerializer):
    # Optionally, if 'amenities' is a JSON field or needs custom formatting
    amenities = serializers.JSONField()  # Adjust according to your model's field type
    
    class Meta:
        model = Property
        fields = [
            'title', 
            'location', 
            'image', 
            'token_price', 
            'annual_gross_rents',
            'bedrooms',
            'bathrooms',
            'size',
            'description',
            'details',
            'amenities',
            'video_urls',
            'property_type',
            'total_tokens',
            'tokensSold',
            'projected_annual_return'
        ]




class TokenTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model =  TokensTransaction
        fields = '__all__' 
