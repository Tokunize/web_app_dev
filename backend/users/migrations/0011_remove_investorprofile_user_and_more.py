# Generated by Django 4.2.16 on 2024-12-30 12:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0037_remove_property_application_ref_number_and_more'),
        ('users', '0010_submitapplication_application_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='investorprofile',
            name='user',
        ),
        migrations.RemoveField(
            model_name='propertyowner',
            name='user',
        ),
        migrations.RemoveField(
            model_name='propertyownerprofile',
            name='user',
        ),
        migrations.DeleteModel(
            name='SubmitApplication',
        ),
        migrations.DeleteModel(
            name='InvestorProfile',
        ),
        migrations.DeleteModel(
            name='PropertyOwner',
        ),
        migrations.DeleteModel(
            name='PropertyOwnerProfile',
        ),
    ]
