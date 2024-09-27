
from django.urls import path
from .views import CreateWalletAPIView, SaveWalletInBackend

urlpatterns = [
    path('create/', CreateWalletAPIView.as_view(), name="wallet-create" ),
    path('save-wallet/',SaveWalletInBackend.as_view(), name="save-wallet" )
]