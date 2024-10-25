
from django.urls import path
from .views import CreateWalletAPIView, SaveWalletInBackend,AddFundsWallet,CheckWalletBalance,CreateTransfersCircle

urlpatterns = [
    path('create/', CreateWalletAPIView.as_view(), name="wallet-create" ),
    path('save-wallet/',SaveWalletInBackend.as_view(), name="save-wallet" ),
    path('fund-wallet/',AddFundsWallet.as_view(), name="fund-wallet" ),
    path('balance-wallet/',CheckWalletBalance.as_view(), name="balance-wallet" ),
    path('transfer/',CreateTransfersCircle.as_view(), name="create-transfer" ),
]