from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from users.authentication import Auth0JWTAuthentication
from users.models import CustomUser

class NotificationAPIView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrar las notificaciones para el usuario autenticado
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Incluye el user en los datos
        request.data['user'] = request.user.id  # Asignar el ID del usuario al request.data
        serializer = NotificationSerializer(data=request.data)
        
        if serializer.is_valid():
            # Guarda la notificación del usuario
            user_notification = serializer.save()  # Guarda la notificación y devuelve la instancia
            
            # Notificar al administrador
            admin = CustomUser.objects.filter(rol='admin').first()  # Obtener el único administrador
            if admin:
                admin_notification_data = {
                    'user': admin.id,  # Asigna el ID del administrador
                    'message': f"New property was created: '{request.data.get('property_name')}'",  # Cambia 'property_name' al nombre correcto del campo
                    'is_read': False,  # O lo que corresponda en tu modelo
                }
                admin_serializer = NotificationSerializer(data=admin_notification_data)
                
                if admin_serializer.is_valid():
                    admin_serializer.save()  # Guarda la notificación para el administrador
            
            return Response(NotificationSerializer(user_notification).data, status=status.HTTP_201_CREATED)  # Devuelve la notificación del usuario
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True  # Asumimos que hay un campo is_read en tu modelo
            notification.save()
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
