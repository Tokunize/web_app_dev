# Generated by Django 4.2.16 on 2025-01-01 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0041_property_reference_number'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['reference_number'], name='reference_number_idx'),
        ),
    ]