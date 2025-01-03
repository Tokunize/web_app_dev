# backend/asgi.py
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from orderbooks.routing import websocket_urlpatterns  # Rutas WebSocket de la app orderbooks

django_asgi_app = get_asgi_application()


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Para manejar solicitudes HTTP
    "websocket": AllowedHostsOriginValidator(
       AuthMiddlewareStack(URLRouter(websocket_urlpatterns))

    ),
})
