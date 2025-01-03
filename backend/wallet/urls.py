
from django.urls import path
from .views import SaveWalletInBackend,AddFundsWallet,CheckWalletBalance

urlpatterns = [
    path('save-wallet/',SaveWalletInBackend.as_view(), name="save-wallet" ),
    path('fund-wallet/',AddFundsWallet.as_view(), name="fund-wallet" ),
    path('balance-wallet/',CheckWalletBalance.as_view(), name="balance-wallet" ),
]