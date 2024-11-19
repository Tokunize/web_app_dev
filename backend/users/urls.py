from django.urls import path
from .views import SyncUserView, UserDetailView, UserListView, UserProfileView,hola_view, ApplicationSubmitListView

urlpatterns = [
    # Ruta para sincronizar o crear un usuario basado en el JWT
    path('sync-user/', SyncUserView.as_view(), name='sync-user'),

    # Ruta para obtener, actualizar o eliminar un usuario específico
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Ruta para listar todos los usuarios
    path('users/', UserListView.as_view(), name='user-list'),

    # Ruta para obtener el perfil del usuario autenticado
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('hola/', hola_view, name='hola'),


#URLS FOR THE APPLICATION SUBMIT
   # Ruta para obtener una aplicación por su reference_number
    path('applications/<uuid:reference_number>/', ApplicationSubmitListView.as_view(), name='application-submit-detail'),
    
    # Otras rutas para obtener todas las aplicaciones o crear/actualizar aplicaciones
    path('applications/', ApplicationSubmitListView.as_view(), name='application-submit-list'),
    path('applications/create/', ApplicationSubmitListView.as_view(), name='application-submit-create'),
    path('applications/update/<uuid:reference_number>/', ApplicationSubmitListView.as_view(), name='application-submit-update'),
]
