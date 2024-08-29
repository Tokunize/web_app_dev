# property/filters.py
from django_filters import rest_framework as filters
from property.models import Property

class PropertyFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    property_type = filters.CharFilter(field_name='property_type', lookup_expr='icontains')
    projected_annual_yield_max = filters.NumberFilter(field_name='projected_annual_yield', lookup_expr='lte')
    projected_rental_yield_max = filters.NumberFilter(field_name='projected_rental_yield', lookup_expr='lte')

    class Meta:
        model = Property
        fields = ['price_min', 'price_max', 'location', 'property_type', 'projected_annual_yield_max', 'projected_rental_yield_max']
