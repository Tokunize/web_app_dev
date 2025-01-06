from django.urls import path
from .views import TransactionListview,TransactionMarketplaceProperty

urlpatterns = [
    
 #TRANSACTIOS GET AND POST
    path('user/all/', TransactionListview.as_view(), name='transactions-list'),
    path('property/marketplace/<int:property_id>/', TransactionMarketplaceProperty.as_view(), name='single-property-transactions-public'),

]
