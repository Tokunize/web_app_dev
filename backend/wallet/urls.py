
from django.urls import path
from .views import CreateWalletAPIView, SaveWalletInBackend,AddFundsWallet

urlpatterns = [
    path('create/', CreateWalletAPIView.as_view(), name="wallet-create" ),
    path('save-wallet/',SaveWalletInBackend.as_view(), name="save-wallet" ),
    path('fund-wallet/',AddFundsWallet.as_view(), name="fund-wallet" )
]