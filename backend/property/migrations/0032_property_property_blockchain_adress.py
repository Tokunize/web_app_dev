# Generated by Django 4.2.16 on 2024-11-22 20:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0031_property_ocupancy_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='property_blockchain_adress',
            field=models.CharField(blank=True, max_length=42, null=True, unique=True),
        ),
    ]
