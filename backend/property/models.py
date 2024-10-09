from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Property(TimeStampedModel): 
    LISTING = 'listing'
    PUBLISHED = 'published'
    DRAFT = 'draft'
    COMING_SOON = 'coming_soon'
    REJECTED = 'rejected'
    UNDER_REVIEW = 'under_review' 


    STATUS_CHOICES = [
        (LISTING, 'Listing'),
        (PUBLISHED, 'Published'),
        (DRAFT, 'Draft'),
        (COMING_SOON, 'Coming Soon'),
        (REJECTED, 'Rejected'),
        (UNDER_REVIEW, 'Under Review') 
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=LISTING, help_text="The current status of the property listing.")
    
    # owner fill formmmmmmm
    property_code = models.CharField(max_length = 50, unique=True, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    details = models.JSONField(blank=True, null=True, help_text="Detailed description and specifics of the property.")
    bedrooms = models.IntegerField(help_text="Number of bedrooms in the property.")
    bathrooms = models.IntegerField(help_text="Number of bathrooms in the property, supporting whole numbers only.")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="The sale or list price of the property.")
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100, null=True, blank=True, help_text="The country where the property is located.")
    property_type = models.CharField(max_length=100, help_text="The type of property, such as apartment, house, or commercial.")
    size = models.DecimalField(max_digits=6, decimal_places=2, help_text="Total interior square footage of the property.")
    year_built = models.IntegerField(help_text="The year in which the property was originally constructed.")
    
    ownershipPercentage = models.IntegerField(blank=True, null=True)
    tenant_turnover = models.DecimalField(blank=True, null=True,max_digits=5, decimal_places=2,)
    vacancy_rate = models.DecimalField(blank=True, null=True, max_digits=5, decimal_places=2)
    rejection_reason = models.TextField(blank=True, null=True)  # Campo para el motivo de rechazo

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
    owner_profile = models.ForeignKey('users.PropertyOwnerProfile',null=True, blank=True, on_delete=models.CASCADE, related_name='properties', help_text="The PropertyOwnerProfile associated with this property.")

    def __str__(self):
        return self.title



class Token(models.Model):
    token_code = models.CharField(max_length=255, unique=True)
    property_code = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='tokens')
    total_tokens = models.PositiveIntegerField()
    tokens_available = models.PositiveIntegerField()
    token_price = models.PositiveIntegerField(null=True, blank=True )


    def __str__(self):
        return self.token_code


class PropertyToken(models.Model):
    property_code = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_tokens')
    token_code = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='property_tokens')
    owner_user_code = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name='property_tokens')
    number_of_tokens = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.number_of_tokens} tokens for {self.property_code} ({self.token_code})"
    



class Transaction(TimeStampedModel):
    property_id = models.ForeignKey(Property, blank=True, null=True, related_name='transactions', on_delete=models.CASCADE)
    transaction_owner_code = models.ForeignKey("users.CustomUser", related_name='transactions', on_delete=models.CASCADE)
    token_code = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='transactions')
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    additional_details = models.JSONField(null=True, blank=True)
    transaction_tokens_amount = models.BigIntegerField(null=True, blank=True)
    referene_number = models.CharField(null=True,blank=True, unique=True)
    class Event(models.TextChoices):
        BUY = 'BUY', 'Buy'
        SELL = 'SELL', 'Sell'
        CANCELLATION = 'CANCELLATION', 'Cancellation'

    event = models.CharField(
        max_length=20,
        choices=Event.choices,
    )

    def __str__(self):
        return f"{self.event} - {self.transaction_amount} on {self.transaction_date.strftime('%Y-%m-%d')}"

    class Meta:
        verbose_name = "Token Transaction"
        verbose_name_plural = "Token Transactions"
        ordering = ['-transaction_date']  # Ordenar de recientes a más antiguos




class PropertyMetrics(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='metrics')
    date = models.DateField()
    tenant_turnover = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    vacancy_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    average_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    net_asset_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.property.title} Metrics on {self.date}"