from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, sub=None, email=None, name=None, rol='owner', password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        if not sub:
            # Si no hay sub, es un superusuario
            user = self.model(email=email, name=name, rol=rol, **extra_fields)
            user.set_password(password)
        else:
            # Usuario normal con sub de Auth0
            user = self.model(sub=sub, email=email, name=name, rol=rol, **extra_fields)

        user.save(using=self._db)
        # self.create_profile(user, rol)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if password is None:
            raise ValueError('Superusers must have a password.')

        return self.create_user(email=email, name=name, password=password, rol='admin', **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('Owner', 'Property Owner'),
        ('Investor', 'Investor'),
    ]

    sub = models.CharField(max_length=255, unique=True, null=True, blank=True)  # sub es opcional
    user_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='owner')

    USERNAME_FIELD = 'email'  # El campo para autenticar será email, útil tanto para sub como para superusers
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

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

class PropertyOwner(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='property_admin_profile')

    def __str__(self):
        return f"{self.user.email} - Property Admin"




