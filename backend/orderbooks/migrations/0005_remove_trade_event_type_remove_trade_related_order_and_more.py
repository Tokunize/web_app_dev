# Generated by Django 4.2.16 on 2024-11-29 12:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orderbooks', '0004_alter_order_order_blockchain_identifier'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trade',
            name='event_type',
        ),
        migrations.RemoveField(
            model_name='trade',
            name='related_order',
        ),
        migrations.RemoveField(
            model_name='trade',
            name='trading_owner',
        ),
        migrations.AddField(
            model_name='trade',
            name='buyer_address',
            field=models.CharField(blank=True, help_text='The address of the user who put the buy order.', max_length=42, null=True),
        ),
        migrations.AddField(
            model_name='trade',
            name='related_buy_order',
            field=models.ForeignKey(blank=True, help_text='The buy order ID associated with this trade.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='trades_as_buy_order', to='orderbooks.order'),
        ),
        migrations.AddField(
            model_name='trade',
            name='related_sell_order',
            field=models.ForeignKey(blank=True, help_text='The sell order ID associated with this trade.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='trades_as_sell_order', to='orderbooks.order'),
        ),
        migrations.AddField(
            model_name='trade',
            name='seller_address',
            field=models.CharField(blank=True, help_text='The address of the user who put the sell order.', max_length=42, null=True),
        ),
    ]