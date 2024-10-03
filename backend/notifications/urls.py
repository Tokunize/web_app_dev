from django.urls import path
from .views import NotificationAPIView

urlpatterns =[
    path('mynotifications/', NotificationAPIView.as_view(), name='notification-list'),
    path('mynotifications/<int:notification_id>/mark_as_read/', NotificationAPIView.as_view(), name='mark-notification-as-read'),
]