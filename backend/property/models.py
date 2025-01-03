from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.utils import timezone
import uuid
from django.core.exceptions import ValidationError


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Property(TimeStampedModel): 
    STATUS_CHOICES = [
    ('listing', 'Listing'), 
    ('published', 'Published'), 
    ('draft', 'Draft'), 
    ('coming_soon', 'Coming Soon'), 
    ('rejected', 'Rejected'), 
    ('under_review', 'Under Review'),
    ('sold', 'Sold')
    ]

    OCUPANCY_STATUS = [
        ('rented', 'Rented'), 
        ('vacant', 'Vacant'), 
        ('occupied', 'Occupied')
    ]

    INVESTMENT_CATEGORY =[
        ('core', 'Core'),
        ('opportunistic', 'Opportunistic' )
    ]

    property_owner = models.ForeignKey("users.CustomUser",null=True, blank=True , on_delete=models.CASCADE, related_name='properties', help_text="El usuario que posee o gestiona esta propiedad.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="listing", help_text="The current status of the property listing.")
    ocupancy_status = models.CharField(max_length=25, choices=OCUPANCY_STATUS, default="rented")
    reference_number = models.UUIDField(default=uuid.uuid4, unique=True, blank=True, null=False, help_text="Automatically generated unique identifier for the property.")

    property_scrow_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    property_code = models.CharField(max_length = 50, unique=True, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    details = models.JSONField(blank=True, null=True, help_text="Detailed description and specifics of the property.")
    bedrooms = models.IntegerField(help_text="Number of bedrooms in the property.")
    bathrooms = models.IntegerField(help_text="Number of bathrooms in the property, supporting whole numbers only.")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="The sale or list price of the property.")
    location = models.CharField(max_length=255)
    post_code = models.CharField(max_length=10, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True, help_text="The country where the property is located.")
    property_type = models.CharField(max_length=100, help_text="The type of property, such as apartment, house, or commercial.")
    size = models.DecimalField(max_digits=6, decimal_places=2, help_text="Total interior square footage of the property.")
    year_built = models.IntegerField(help_text="The year in which the property was originally constructed.")
    property_blockchain_adress = models.CharField(max_length=42, unique=True, blank=True, null=True)


    ownershipPercentage = models.IntegerField(blank=True, null=True)
    tenant_turnover = models.DecimalField(blank=True, null=True,max_digits=5, decimal_places=2,)
    vacancy_rate = models.DecimalField(blank=True, null=True, max_digits=5, decimal_places=2)
    rejection_reason = models.TextField(blank=True, null=True)  # Campo para el motivo de rechazo
    rejection_reason_comment = models.TextField(blank=True, null=True, help_text="Extra information for the rejection reason")

    investment_category =  models.CharField(max_length=25, choices=INVESTMENT_CATEGORY, default="core")

    # admin fill form 
    image = ArrayField(models.URLField(max_length=500), blank=True, null=True, help_text="A list of URLs pointing to images of the property.")
    video_urls = ArrayField(models.URLField(max_length=500), blank=True, null=True, help_text="A list of URLs pointing to videos of the property.")
    amenities = models.JSONField(blank=True, null=True, help_text="JSON formatted list of property amenities such as pool, gym, pet-friendly, etc.")
    active = models.BooleanField(null=True, blank=True, help_text="A boolean to control if the property is listed or if it's a coming soon property.")
    
    # Financial details
    total_investment_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Total amount of money invested in the property, including purchase and renovation costs.")
    underlying_asset_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="The base price of the property without additional fees or expenses.")
    closing_costs = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Expenses paid at the time of finalizing the property deal, such as legal and escrow fees.")
    upfront_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Initial fees paid to the platform or DAO for listing and other administrative services.")
    operating_reserve = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Funds set aside to cover the ongoing operational costs and emergency expenses.")
    projected_annual_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="The projected annual return on investment as a percentage.")
    projected_rental_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="The projected annual return from rent as a percentage of the property's price.")
    
    # Annual operational costs
    projected_annual_return = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    annual_gross_rents = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="The total rental income expected to be received annually.")
    property_taxes = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Taxes charged annually based on the property's assessed value.")
    homeowners_insurance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Annual insurance cost covering potential damage to the property.")
    property_management = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Annual fee paid to a management company for managing the property.")
    dao_administration_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Annual fees paid to the DAO for administrative services.")
    annual_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Net annual revenue from the property, after deducting all expenses.")
    monthly_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Net income from the property calculated on a monthly basis.")
    equity_listed = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    projected_annual_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Estimated yearly cash flow based on projected rental and operational costs.")
    legal_documents_url = models.URLField(max_length=500, null=True, blank=True, help_text="URL to access legal documents related to this property.")

    # Indicadores de estado
    owner_fields_completed = models.BooleanField(default=False)
    admin_fields_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reference_number'], name='reference_number_idx'),
        ]
    
    # Function to get the first image
    def get_first_image(self):
        if self.image and len(self.image) > 0:
            return self.image[0]
        return None
    
     # Function to get associated tokens
    def get_tokens(self):
        tokens = self.tokens.all()  # Using the related_name "tokens" from Token model
        return [{'token_code': token.token_code, 'total_tokens': token.total_tokens, 'tokens_available': token.tokens_available, 'token_price': token.token_price} for token in tokens]

     # Function to change status
    def change_status(self, new_status):
        """
        Change the status of the property to a valid value.

        Args:
            new_status (str): The new status to assign.

        Raises:
            ValidationError: If the new status is not valid.
        """
        valid_statuses = [choice[0] for choice in self.STATUS_CHOICES]
        if new_status not in valid_statuses:
            raise ValidationError(f"{new_status} is not a valid status. Valid options are: {valid_statuses}")
        
        self.status = new_status
        self.save(update_fields=["status"])  # Optimized save for just the 'status' field



class PropertyUpdates(models.Model):
    property = models.ForeignKey(Property,on_delete=models.CASCADE, related_name='updates', help_text="The property associated with this update." )
    update_title = models.CharField(max_length=255, help_text="The title of the update")
    update_date = models.DateTimeField(default=timezone.now, help_text="The date when the update occurred or was recorded.")
    update_type = models.CharField(max_length=100, help_text="The type of update, e.g., repair, renovation, or general maintenance.")
    update_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="The cost associated with this update, if applicable.")
    update_attachments = ArrayField(models.URLField(max_length=500), blank=True, null=True, help_text="A list of URLs pointing to images or documents related to the update.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Update on {self.property.title}: {self.title}"
    

class PropertyToken(models.Model):
    property_code = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_tokens')
    token_code = models.ForeignKey("blockchain.Token", on_delete=models.CASCADE, related_name='property_tokens')
    owner_user_code = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name='property_tokens')
    number_of_tokens = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.number_of_tokens} tokens for {self.property_code} ({self.token_code})"
    
