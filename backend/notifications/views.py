from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from users.authentication import Auth0JWTAuthentication

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
            serializer.save()  # Solo llama a save(), ya que el user está en request.data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
