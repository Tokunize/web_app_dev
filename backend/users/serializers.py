from rest_framework import serializers
from .models import CustomUser, PropertyOwnerProfile, InvestorProfile

# Serializadores para perfiles
class PropertyOwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyOwnerProfile
        fields = ['number_of_properties']

class InvestorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorProfile
        fields = ['total_investment']

ROLE_PROFILE_MAPPING = {
    'owner': PropertyOwnerProfileSerializer,
    'investor': InvestorProfileSerializer,
}

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    profile = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'is_active', 'is_staff', 'rol', 'password', 'profile']

    def validate_email(self, value):
        """
        Check that the email is unique, but exclude the current instance
        """
        if self.instance:
            if CustomUser.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        else:
            if CustomUser.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        user = CustomUser.objects.create_user(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

    def get_profile(self, obj):
        profile_class = ROLE_PROFILE_MAPPING.get(obj.rol)
        if profile_class:
            profile = profile_class.Meta.model.objects.filter(user=obj).first()
            if profile:
                return profile_class(profile).data
        return None


