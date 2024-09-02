from django.urls import path
from .views import CreateUserView,RefreshTokenView, UserDetailView, UserListView, UserProfileView,LoginView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('register/', CreateUserView.as_view(), name='register'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('login/', LoginView.as_view(), name='login'),  # Añade esta línea
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
]
