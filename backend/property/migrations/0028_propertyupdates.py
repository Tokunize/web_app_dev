# Generated by Django 4.2.16 on 2024-10-24 10:18

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0027_property_post_code'),
    ]

    operations = [
        migrations.CreateModel(
            name='PropertyUpdates',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('update_title', models.CharField(help_text='The title of the update', max_length=255)),
                ('update_date', models.DateTimeField(default=django.utils.timezone.now, help_text='The date when the update occurred or was recorded.')),
                ('update_type', models.CharField(help_text='The type of update, e.g., repair, renovation, or general maintenance.', max_length=100)),
                ('update_cost', models.DecimalField(blank=True, decimal_places=2, help_text='The cost associated with this update, if applicable.', max_digits=12, null=True)),
                ('update_attachments', django.contrib.postgres.fields.ArrayField(base_field=models.URLField(max_length=500), blank=True, help_text='A list of URLs pointing to images or documents related to the update.', null=True, size=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('property', models.ForeignKey(help_text='The property associated with this update.', on_delete=django.db.models.deletion.CASCADE, related_name='updates', to='property.property')),
            ],
        ),
    ]