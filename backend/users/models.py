# models.py

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, rol='owner', **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, rol=rol, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        self.create_profile(user, rol)
        return user

    def create_profile(self, user, rol):
        profile_classes = {
            'owner': PropertyOwnerProfile,
            'investor': InvestorProfile,
            'admin': PropertyAdminProfile,
            'developer': DeveloperProfile,
        }
        profile_class = profile_classes.get(rol)
        if profile_class:
            profile_class.objects.get_or_create(user=user)

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, rol='admin', **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('owner', 'Property Owner'),
        ('investor', 'Investor'),
        ('admin', 'Property Admin'),
        ('developer', 'Developer'),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='owner')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    

# models.py 

class PropertyOwnerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='property_owner_profile')
    number_of_properties = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email} - Property Owner"

class InvestorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='investor_profile')
    total_investment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.email} - Investor"

class PropertyAdminProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='property_admin_profile')

    def __str__(self):
        return f"{self.user.email} - Property Admin"

class DeveloperProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='developer_profile')

    def __str__(self):
        return f"{self.user.email} - Developer"

