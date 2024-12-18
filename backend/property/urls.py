from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateUpdateView,
    # PropertyDetailView,
    PropertyFilterView,
    PublicPropertyList,
    TokenListView,
    TransactionListview,
    InvestedProperties,
    SinglePropertyTransactionListView,
    UserInvestmentSummaryAPIView,
    PropertyStatusUpdateView,
    PublicSinglePropertyTransactionListView,
    PropertyUpdateListView,
    MarketplaceListView,
    PropertyDetailLandingPage,
    PropertyManagmentListView,
    AdminOverviewListView,
    InvestorAssetsGetView,
    PropertySmartContract,
    PropertyTradeSellListView,
    InvestorTradingPropertyDetails
)

urlpatterns = [
    # Property related URLs
    path('properties/private/', PropertyListView.as_view(), name='property-list'),
    path('properties/public/', PublicPropertyList.as_view(), name='property-list'),

    path('create/', PropertyCreateUpdateView.as_view(), name='property-create-update'),
    # path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    path('<int:pk>/landing-page/', PropertyDetailLandingPage.as_view(), name='property-detail-landing-page'),


    path('properties/<int:propertyId>/status/', PropertyStatusUpdateView.as_view(), name='property-status-update'),
    
    # Property filtering and unique values
    path('properties/filter/', PropertyFilterView.as_view(), name='property-filter'),

    #TOKEN - GET AND POST URL
    path('tokens/', TokenListView.as_view(), name='token-list'), 

    #TRANSACTIOS GET AND POST
    path('transactions/', TransactionListview.as_view(), name='transactions-list'),
    path('transactions/property/<int:property_id>/', SinglePropertyTransactionListView.as_view(), name='single-property-transactions'),
    path('transactions/<int:property_id>/', PublicSinglePropertyTransactionListView.as_view(), name='single-property-transactions-public'),

    

    #GET ALL THE PROPERTIES ONE INVESTOR INVESTED
    path('investment/', InvestedProperties.as_view(), name='invested-properties'),

    #CREATE PROPERTY UPDATE URL - POST
    path('updates/create/', PropertyUpdateListView.as_view(), name='updates-create'),



# -------------------------------------------------------

    #NEW URLS IMPROVED THE VIEWS AND SERIALIZER
    path("marketplace-list/",MarketplaceListView.as_view(), name="marketplace-property-list" ),
    

    #DASHBOARD ADMIN URLS 
    path("property-managment/",PropertyManagmentListView.as_view(), name="property-managment-admin" ),
    path("overview-dashboard-admin/",AdminOverviewListView.as_view(), name="overview-dashboard-admin" ),

    #INVESTORS
    path('investment-summary/', UserInvestmentSummaryAPIView.as_view(), name='investor-overview'),
    path('investor-assets/', InvestorAssetsGetView.as_view(), name="investor-assets"),
    path('trading/property/<str:referenceNumber>/', InvestorTradingPropertyDetails.as_view(), name="details-property-trading"),
    #OWNERS


    #BLOCKCHAIN
    path('smart-contract/<str:referenceNumber>/', PropertySmartContract.as_view(), name="property-smart-contract-address"),
    path('sold/', PropertyTradeSellListView.as_view(), name="sold-properties"),



]
