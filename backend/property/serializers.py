from rest_framework import serializers
from property.models import Property


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id','title', 'location', 'image', 'token_price', 'total_tokens','tokensSold',  'projected_annual_return','property_type']

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
            'tokensSold'
        ]




# class PropertyFinalcialSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Property
#         fields = []
