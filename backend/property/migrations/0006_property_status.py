# Generated by Django 4.2.16 on 2024-09-05 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0005_tokenstransaction_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='status',
            field=models.CharField(choices=[('listing', 'Listing'), ('published', 'Published')], default='listing', help_text='The current status of the property listing.', max_length=20),
        ),
    ]