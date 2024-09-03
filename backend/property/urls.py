# api/urls.py
from django.urls import path
from .views import PropertyListView, PropertyDetailView, PropertyFilterView, TokensTransactionListCreateView,UniqueLocationsView, PriceRangeView, YieldRangeView, PropertyTypeListView, TokensTransactionDetailView

urlpatterns = [
    path('properties/', PropertyListView.as_view()),
    path('properties/<int:pk>/', PropertyDetailView.as_view()),
    #USE THIS FILTER TO USE IN THE SHORT BY
    path('properties/filter/', PropertyFilterView.as_view()),
    #USE THIS TO GET ALL THE DIFFERENT LOCATIONS WE HAVE AND SHOW IN THE DROPDOWN 
    path('properties/locations/', UniqueLocationsView.as_view(), name='unique-locations'),
    path('properties/price-range/', PriceRangeView.as_view()),
    path('properties/yields/', YieldRangeView.as_view(), name='yields-range'),
    #USE THIS TO GET ALL THE UNIQUES PROPERTY TYPES WE HAVE ON OUR DATABASE
    path('properties/types/', PropertyTypeListView.as_view(), name='property-type-list'),

    path('<int:property_id>/tokens-transactions/', TokensTransactionListCreateView.as_view(), name='tokens-transaction-list-create'),
    path('tokens-transactions/<int:pk>/', TokensTransactionDetailView.as_view(), name='tokens-transaction-detail'),

]