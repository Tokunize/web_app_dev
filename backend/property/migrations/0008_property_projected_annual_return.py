# Generated by Django 4.2.16 on 2024-09-05 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0007_remove_property_projected_annual_return_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='projected_annual_return',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
    ]