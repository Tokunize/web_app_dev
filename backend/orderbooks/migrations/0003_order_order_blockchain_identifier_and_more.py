# Generated by Django 4.2.16 on 2024-11-29 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orderbooks', '0002_alter_order_order_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='order_blockchain_identifier',
            field=models.CharField(blank=True, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_status',
            field=models.CharField(choices=[('expired', 'Expired'), ('valid', 'Valid'), ('canceled', 'Canceled'), ('processed', 'Processed')], default='valid', help_text='the status of the order', max_length=10),
        ),
    ]