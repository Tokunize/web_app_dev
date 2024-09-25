from rest_framework import serializers
from property.models import(
    Property,
    Token,
    Transaction,PropertyToken
)

#SERIALZERS FOR TOKENS 

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'

#SERIALIZER FOR THE PROPERTY ON MARKETPLACE LANDING PAGE
class PropertySerializerList(serializers.ModelSerializer):
    tokens = TokenSerializer(many=True, read_only=True) 
    class Meta:
        model = Property
        fields = [
                    'id', 'title', 'status', 'location', 'image', 
                    'active','property_code',
                    'projected_annual_return', 'property_type', 'created_at',
                    'bedrooms', 'bathrooms', 'price', 'size', 'year_built',
                    'country', 'description','amenities', 'tokens'
                ]
        
#SERIALZIZERS FOR SINGLE PORPERTY PAGE AND OVERVIEW, FINATIAL, DOCUMENTS, ACTIVITY AND IMAEGES
class PropertyImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ["image", 'video_urls']

class AllDetailsPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class PropertyOverviewSerializer(serializers.ModelSerializer):
    amenities = serializers.JSONField()  
    tokens = TokenSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'title', 
            'location', 
            'image', 
            'annual_gross_rents',
            'bedrooms',
            'bathrooms',
            'size',
            'description',
            'details',
            'amenities',
            'video_urls',
            'property_type',
            'projected_annual_return',
            'tokens'
        ]

class PropertyFinancialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "total_investment_value",
            "underlying_asset_price",
            "closing_costs",
            "upfront_fees",
            "operating_reserve",
            "projected_annual_yield",
            "projected_rental_yield",
            "projected_annual_return",
            "annual_gross_rents",
            "property_taxes",
            "homeowners_insurance",
            "property_management",
            "dao_administration_fees",
            "annual_cash_flow",
            "monthly_cash_flow",
            "projected_annual_cash_flow",
            "legal_documents_url",
        ]


class PropertyTokenPaymentSerializer(serializers.ModelSerializer):
    tokens = TokenSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
                'id', 'title', 'location', 'image', 
                'property_type',
                'price',
                'country', 'tokens'
        ]

#SERIALIZER TO CREATE A PROPERTY, TWO STEPS, OWNER FILL BASIC DATA AND ADMIN FILL THE FINANCTIAL DATA
class CreatePropertySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)  # Definir `id` como opcional para actualizaciones

    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False},
            'video_urls': {'required': False},
            'amenities': {'required': False},
            'active': {'required': False},
            'total_investment_value': {'required': False},
            'underlying_asset_price': {'required': False},
            'closing_costs': {'required': False},
            'upfront_fees': {'required': False},
            'operating_reserve': {'required': False},
            'projected_annual_yield': {'required': False},
            'projected_rental_yield': {'required': False},
            'annual_gross_rents': {'required': False},
            'property_taxes': {'required': False},
            'homeowners_insurance': {'required': False},
            'property_management': {'required': False},
            'dao_administration_fees': {'required': False},
            'annual_cash_flow': {'required': False},
            'monthly_cash_flow': {'required': False},
            'projected_annual_cash_flow': {'required': False},
            'legal_documents_url': {'required': False},
        }

    def validate(self, data):
        user = self.context['request'].user
        if 'owner' in user.rol:
            required_fields = ['title','status','owner_profile', 'description', 'bedrooms', 'amenities', 'bathrooms', 'price', 'location', 'country', 'property_type', 'size', 'year_built']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError({field: f"{field.replace('_', ' ').capitalize()} is required for owners." for field in missing_fields})

        elif 'admin' in user.rol:
            property_instance = Property.objects.filter(id=data.get('id')).first()
            if not property_instance:
                raise serializers.ValidationError({'id': 'Property with the given ID does not exist.'})

            if not property_instance.owner_fields_completed:
                raise serializers.ValidationError('Owner fields must be completed before adding admin fields.')

            admin_required_fields = ['image','active',
                                     'total_investment_value', 'underlying_asset_price', 'closing_costs', 'upfront_fees',
                                     'operating_reserve', 'projected_annual_yield', 'projected_rental_yield',
                                     'annual_gross_rents', 'property_taxes', 'homeowners_insurance', 'property_management',
                                     'dao_administration_fees', 'annual_cash_flow', 'monthly_cash_flow', 'projected_annual_cash_flow',
                                        'legal_documents_url',
                                     'status']
            missing_admin_fields = [field for field in admin_required_fields if field not in data]
            if missing_admin_fields:
                raise serializers.ValidationError({field: f"{field.replace('_', ' ').capitalize()} is required for admins." for field in missing_admin_fields})

        return data




#SERIALIZER FOR TRANSACTIONS

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
 

class PropertyTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyToken
        fields = ['number_of_tokens']
        
class InvestedPropertiesSerialier(serializers.ModelSerializer):
    tokens = TokenSerializer(many=True, read_only=True)
    user_tokens = serializers.SerializerMethodField()  # Añadir el campo para tokens del usuario
    first_image = serializers.SerializerMethodField()  # Custom method field for the first image

    class Meta:
        model = Property
        fields = ['title', 'tokens', 'user_tokens','first_image',
            "total_investment_value", 
            "underlying_asset_price",
            "closing_costs",
            "upfront_fees",
            "operating_reserve",
            "projected_annual_yield",
            "projected_rental_yield", 
            "projected_annual_return",
            "annual_gross_rents",
            "property_taxes",
            "homeowners_insurance",
            "property_management",
            "dao_administration_fees",
            "annual_cash_flow",
            "monthly_cash_flow",
            "property_type",
            "price",
            "projected_annual_cash_flow",
            "legal_documents_url",
            "location",
            "updated_at"
        ]

    def get_user_tokens(self, obj):
        user = self.context['request'].user        
        property_tokens = PropertyToken.objects.filter(
            property_code=obj,
            owner_user_code=user
        )
        
        return PropertyTokenSerializer(property_tokens, many=True).data
    def get_first_image(self, obj):
        # Return the first image from the image ArrayField if available, else None
        return obj.image[0] if obj.image and len(obj.image) > 0 else None
    

class InvestmentOverviewSerializer(serializers.ModelSerializer):
    tokens = TokenSerializer(many=True, read_only=True)

    yield_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = ['title', 'tokens','location', 'property_type','yield_data']

    def get_yield_data(self, obj):
        first_image = obj.image[0] if obj.image and len(obj.image) > 0 else None

        return {
            "title": obj.title,
            "projected_annual_yield": obj.projected_annual_yield,
            "projected_rental_yield": obj.projected_rental_yield,
            "projected_annual_return": obj.projected_annual_return,
            "image": first_image,
            "location": obj.location 
        }

