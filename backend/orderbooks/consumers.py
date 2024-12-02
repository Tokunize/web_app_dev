import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Order, Trade
from channels.db import database_sync_to_async

class OrderBookConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Definir el grupo de WebSocket para la orden de libros
        self.room_group_name = 'orderbooks'

        # Unirse al grupo de WebSocket
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Aceptar la conexión WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Dejar el grupo cuando se desconecte
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        """ Lógica para recibir mensajes del cliente WebSocket (si es necesario) """
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Responder al cliente (si es necesario)
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_order_update(self, event):
        """ Método llamado para enviar actualizaciones cuando una orden cambia """
        order_data = event['order_data']
        await self.send(text_data=json.dumps({
            'order_data': order_data
        }))

    async def send_trade_update(self, event):
        """ Método llamado para enviar actualizaciones cuando un trade se ejecuta """
        trade_data = event['trade_data']
        await self.send(text_data=json.dumps({
            'trade_data': trade_data
        }))

    @database_sync_to_async
    def get_order_data(self):
        """ Lógica para obtener las órdenes, puedes personalizar la consulta según tus necesidades """
        orders = Order.objects.filter(order_status="valid")  # Obtén solo las órdenes activas
        return list(orders.values())  # Retorna las órdenes como una lista de diccionarios

    @database_sync_to_async
    def get_trade_data(self):
        """ Lógica para obtener las transacciones más recientes """
        trades = Trade.objects.all().order_by('-executed_at')[:10]  # Las últimas 10 transacciones
        return list(trades.values())
