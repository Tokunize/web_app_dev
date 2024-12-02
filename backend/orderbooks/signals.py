# orderbook/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order, Trade
import json

@receiver(post_save, sender=Order)
def order_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    order_data = {
        'id': str(instance.order_reference_number),
        'order_type': instance.order_type,
        'order_price': instance.order_price,
        'order_quantity': str(instance.order_quantity),
        'order_status': instance.order_status,
        'order_owner': instance.order_owner.id,
        'property': instance.property.reference_number,
    }

    async_to_sync(channel_layer.group_send)(
        'orderbook_orderbook', 
        {
            'type': 'send_order_update',
            'order_data': order_data,
        }
    )

@receiver(post_save, sender=Trade)
def trade_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        trade_data = {
            'trade_id': str(instance.id),
            'trade_price': instance.trade_price,
            'trade_quantity': str(instance.trade_quantity),
            'executed_at': instance.executed_at,
            'buyer': instance.buyer_address,
            'seller': instance.seller_address,
        }

        async_to_sync(channel_layer.group_send)(
            'orderbook_orderbook',
            {
                'type': 'send_trade_update',
                'trade_data': trade_data,
            }
        )
