from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateUpdateView,
    PropertyDetailView,
    PropertyFilterView,
    PublicPropertyList,
    TokenListView,
    TransactionListview,
    InvestedProperties
)

urlpatterns = [
    # Property related URLs
    path('properties/private/', PropertyListView.as_view(), name='property-list'),
    path('properties/public/', PublicPropertyList.as_view(), name='property-list'),

    path('create/', PropertyCreateUpdateView.as_view(), name='property-create-update'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    
    # Property filtering and unique values
    path('properties/filter/', PropertyFilterView.as_view(), name='property-filter'),

    #TOKEN - GET AND POST URL
    path('tokens/', TokenListView.as_view(), name='token-list'), 

    #TRANSACTIOS GET AND POST
    path('transactions/', TransactionListview.as_view(), name='transactions-list'),

    #GET ALL THE PROPERTIES ONE INVESTOR INVESTED
    path('investment/', InvestedProperties.as_view(), name='invested-properties')
]
