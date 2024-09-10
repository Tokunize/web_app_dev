from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateUpdateView,
    PropertyDetailView,
    PropertyFilterView,
    TokensTransactionListCreateView,
    TokensTransactionDetailView,
    PublicPropertyList
    # OwnerPropertiesView,
    # AdminPropertyView
)

urlpatterns = [
    # Property related URLs
    path('properties/private/', PropertyListView.as_view(), name='property-list'),
    path('properties/public/', PublicPropertyList.as_view(), name='property-list'),

    path('create/', PropertyCreateUpdateView.as_view(), name='property-create-update'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    
    # Property filtering and unique values
    path('properties/filter/', PropertyFilterView.as_view(), name='property-filter'),
    # path('properties/locations/', UniqueLocationsView.as_view(), name='unique-locations'),
    # path('properties/price-range/', PriceRangeView.as_view(), name='price-range'),
    # path('properties/yields/', YieldRangeView.as_view(), name='yields-range'),
    # path('properties/types/', PropertyTypeListView.as_view(), name='property-type-list'),

    # Token transactions related URLs
    path('<int:property_id>/tokens-transactions/', TokensTransactionListCreateView.as_view(), name='tokens-transaction-list-create'),
    path('tokens-transactions/<int:pk>/', TokensTransactionDetailView.as_view(), name='tokens-transaction-detail'),
]
