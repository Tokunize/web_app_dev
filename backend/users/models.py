from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from property.models import Property

# 1. Custom User Manager
class UserProfileManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# 2. Base UserProfile
class UserProfile(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserProfileManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
    

# 3. Roles: PropertyOwner, Investor, Developer, PropertyAdmin
class PropertyOwner(UserProfile):
    owned_properties = models.ManyToManyField(Property, related_name='owners')

    class Meta:
        permissions = [
            ("view_property", "Can view properties"),
            ("upload_property", "Can upload properties"),

        ]

class Investor(UserProfile):
    invested_properties = models.ManyToManyField(Property, related_name='investors')

    class Meta:
        permissions = [
            ("view_investment", "Can view investments"),
            ("add_investment", "Can add new investment"),
            ("view_property", "Can view properties"),

        ]

class PropertyAdmin(UserProfile):
    managed_properties = models.ManyToManyField(Property, related_name='admins')

    class Meta:
        permissions = [
            ("manage_property", "Can manage properties"),
            ("delete_property", "Can delete properties"),
        ]


# class Developer(UserProfile):
#         developed_properties = models.ManyToManyField(Property, related_name='developers')

#         class Meta:
#             permissions = [
#                 ("view_project", "Can view projects"),
#                 ("add_project", "Can add new project"),
#             ]    

