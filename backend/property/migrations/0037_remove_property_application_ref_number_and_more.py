# Generated by Django 4.2.16 on 2024-12-30 12:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0036_property_property_scrow_address'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='application_ref_number',
        ),
        migrations.RemoveField(
            model_name='property',
            name='owner_profile',
        ),
        migrations.DeleteModel(
            name='PropertyMetrics',
        ),
    ]
