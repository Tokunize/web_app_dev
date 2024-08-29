from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField

class Property(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    details = models.JSONField(blank=True, null=True, help_text="Detailed description and specifics of the property.")  # Updated
    bedrooms = models.IntegerField(help_text="Number of bedrooms in the property.")
    bathrooms = models.DecimalField(max_digits=2, decimal_places=1, help_text="Number of bathrooms in the property, supporting half-baths as decimals.")
    projected_annual_return = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="The projected annual return as a percentage.")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="The sale or list price of the property.")
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100, null=True, blank=True, help_text="The country where the property is located.")
    property_type = models.CharField(max_length=100, help_text="The type of property, such as apartment, house, or commercial.")
    size = models.DecimalField(max_digits=6, decimal_places=2, help_text="Total interior square footage of the property.")
    year_built = models.IntegerField(help_text="The year in which the property was originally constructed.")
    image = ArrayField(models.URLField(max_length=500), blank=True, null=True, help_text="A list of URLs pointing to images of the property.")
    video_urls = ArrayField(models.URLField(max_length=500), blank=True, null=True, help_text="A list of URLs pointing to videos of the property.")
    amenities = models.JSONField(blank=True, null=True, help_text="JSON formatted list of property amenities such as pool, gym, pet-friendly, etc.")

    # Financial details
    total_investment_value = models.DecimalField(max_digits=12, decimal_places=2, help_text="Total amount of money invested in the property, including purchase and renovation costs.")
    underlying_asset_price = models.DecimalField(max_digits=12, decimal_places=2, help_text="The base price of the property without additional fees or expenses.")
    closing_costs = models.DecimalField(max_digits=10, decimal_places=2, help_text="Expenses paid at the time of finalizing the property deal, such as legal and escrow fees.")
    upfront_fees = models.DecimalField(max_digits=10, decimal_places=2, help_text="Initial fees paid to the platform or DAO for listing and other administrative services.")
    operating_reserve = models.DecimalField(max_digits=10, decimal_places=2, help_text="Funds set aside to cover the ongoing operational costs and emergency expenses.")
    projected_annual_yield = models.DecimalField(max_digits=5, decimal_places=2, help_text="The projected annual return on investment as a percentage.")
    projected_rental_yield = models.DecimalField(max_digits=5, decimal_places=2, help_text="The projected annual return from rent as a percentage of the property's price.")

    # Annual operational costs
    annual_gross_rents = models.DecimalField(max_digits=12, decimal_places=2, help_text="The total rental income expected to be received annually.")
    property_taxes = models.DecimalField(max_digits=10, decimal_places=2, help_text="Taxes charged annually based on the property's assessed value.")
    homeowners_insurance = models.DecimalField(max_digits=10, decimal_places=2, help_text="Annual insurance cost covering potential damage to the property.")
    property_management = models.DecimalField(max_digits=10, decimal_places=2, help_text="Annual fee paid to a management company for managing the property.")
    dao_administration_fees = models.DecimalField(max_digits=10, decimal_places=2, help_text="Annual fees paid to the DAO for administrative services.")
    annual_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, help_text="Net annual revenue from the property, after deducting all expenses.")
    monthly_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, help_text="Net income from the property calculated on a monthly basis.")
    projected_annual_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, help_text="Estimated yearly cash flow based on projected rental and operational costs.")

    # Tokenization specifics
    total_tokens = models.BigIntegerField(help_text="Total number of tokens issued for the property, representing ownership shares.")
    tokensSold = models.BigIntegerField(default=0, help_text="Current number of tokens sold.")
    token_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per token, reflecting the value of a fractional ownership share.")
    blockchain_address = models.CharField(max_length=255, default="0xINVALID_DEFAULT_ADDRESS", help_text="Blockchain address where the property's tokens are managed and transactions are recorded.")
    legal_documents_url = models.URLField(max_length=500, null=True, blank=True, help_text="URL to access legal documents related to this property.")

    def __str__(self):
        return self.title
