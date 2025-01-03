from django.db import models
import uuid

class Token(models.Model):

    # Definimos las opciones para el tipo de token utilizando TextChoices
    class TokenType(models.TextChoices):
        PROPERTY_TOKEN = 'PropertyToken', 'Property Token'
        UTILITY_TOKEN = 'Utility Token', 'Utility Token'

    token_blockchain_address = models.CharField(max_length=42, unique=True, db_index=True)  # Indexado para consultas rápidas
    token_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # UUID generado automáticamente y único
    property_code = models.ForeignKey("property.Property", on_delete=models.CASCADE, related_name='tokens')  # Renombrado para claridad
    total_tokens = models.PositiveIntegerField()
    tokens_available = models.PositiveIntegerField()
    token_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Mejor para precios
    token_type = models.CharField(max_length=20, choices=TokenType.choices, default=TokenType.PROPERTY_TOKEN)  # Tipo de token
    created_at = models.DateTimeField(auto_now_add=True)  # Se establece solo cuando se crea el token.


    def __str__(self):
        return str(self.token_code)

    class Meta:
        indexes = [
            models.Index(fields=['token_blockchain_address']),
            models.Index(fields=['token_code']),
        ]
        verbose_name = "Token"
        verbose_name_plural = "Tokens"
