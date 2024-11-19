from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from property.models import PropertyToken
import uuid

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

    COMMUNICATION_METHOD = [
    ("email", "Email"),
    ("phone", "Phone")
    ]

    sub = models.CharField(max_length=255, unique=True, null=True, blank=True)  # sub es opcional
    user_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=50, null=True, blank=True)
    national_insurance = models.CharField(max_length=15 , unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=17, unique=True, null=True, blank=True)
    contact_method = models.CharField(max_length=20, choices=COMMUNICATION_METHOD, default="email")
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
    
    def get_tokens_by_property(self):
        """
        Devuelve un diccionario con el número de tokens que tiene el usuario por cada propiedad.
        """
        # Recuperamos todos los tokens de las propiedades para este usuario
        property_tokens = PropertyToken.objects.filter(owner_user_code=self)

        # Creamos un diccionario con el número de tokens por cada propiedad
        tokens_by_property = {}
        for property_token in property_tokens:
            property_code = property_token.property_code
            tokens_by_property[property_code.id] = property_token.number_of_tokens

        return tokens_by_property

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
    

class SubmitApplication(models.Model):
    STATUS_CHOICES = [
        ('acepted', 'Acepted'),
        ('draf', 'Draft'),
        ('rejected', 'Rejected'),
        ('under_review', 'Under Review')
    ]

    application_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,  # Enlazamos el campo con las opciones
        default='draf'  # Valor por defecto (por ejemplo, 'DRAFT')
    )

    # Detalles del solicitante
    applicant_name = models.CharField(max_length=255)
    applicant_address = models.CharField(max_length=255)
    national_insurance = models.CharField(max_length=15)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    reference_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # Información sobre si están presentando la propiedad en su nombre
    is_property_submitted_for_self = models.BooleanField(default=True)

    # Si no es por sí mismo, entonces pertenece a una organización
    is_on_behalf_of_organization = models.BooleanField(default=False)
    organization_name = models.CharField(max_length=255, null=True, blank=True)
    position_or_role = models.CharField(max_length=255, null=True, blank=True)
    organization_type = models.CharField(max_length=100, null=True, blank=True)
    business_registration_number = models.CharField(max_length=100, null=True, blank=True)
    unique_tax_reference = models.CharField(max_length=100, null=True, blank=True)
    is_broker_dealer = models.BooleanField(default=False)
    relationship_with_asset = models.TextField(null=True, blank=True)
    
    # Método de comunicación preferido
    preferred_communication_method = models.CharField(max_length=10, choices=[('email', 'Email'), ('phone', 'Phone')], default='email')

    # Información de la propiedad
    property_name = models.CharField(max_length=255)
    property_type = models.CharField(max_length=100, choices=[('office', 'Office'), ('retail', 'Retail'), ('industrial', 'Industrial'), ('mixed_use', 'Mixed-Use'), ('residential', 'Residential')])
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postcode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)
    total_square_footage = models.FloatField()
    year_built = models.IntegerField()
    amenities = models.TextField()
    current_use_of_property = models.CharField(max_length=100, choices=[('rented', 'Rented'), ('owner_occupied', 'Owner-Occupied'), ('vacant', 'Vacant')])
    property_images = models.FileField(upload_to='property_images/', null=True, blank=True)
    floor_plans = models.FileField(upload_to='floor_plans/', null=True, blank=True)
    video_tour = models.FileField(upload_to='video_tours/', null=True, blank=True)

    # Información financiera
    market_value = models.FloatField()
    equity_percentage_to_tokenize = models.FloatField()
    lease_terms = models.TextField()
    current_occupancy_rate = models.FloatField()
    revenue_last_tax_year = models.FloatField()

    # Información de préstamos
    loan_details = models.TextField(null=True, blank=True)
    operating_expenses = models.TextField()
    
    # Subida de documentos
    property_deed = models.FileField(upload_to='legal_documents/', null=True, blank=True)
    lease_agreements = models.FileField(upload_to='legal_documents/', null=True, blank=True)
    tax_compliance_documents = models.FileField(upload_to='legal_documents/', null=True, blank=True)
    
    # Otros comentarios
    additional_comments = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Application for {self.property_name} by {self.applicant_name}"








