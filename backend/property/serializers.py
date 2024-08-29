from rest_framework import serializers
from property.models import Property


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id','title', 'location', 'image', 'token_price',  'projected_annual_return','property_type']

    #AS THE IMAGE IT'S AN ARRAY WE WILL SEND JUST THE FIRST ONE FOR THE CARDS LIST
    def get_first_image(self, obj):
        # Verifica si el array de imágenes no está vacío y retorna la primera imagen
        return obj.image[1] if obj.image else None


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
            'property_type'
        ]



# class PropertyFinalcialSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Property
#         fields = []
