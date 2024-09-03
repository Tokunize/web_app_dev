from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from property.models import Property, TokensTransaction
from .serializers import PropertySerializer, PropertyOverviewSerializer,PropertyImagesSerializer,TokenTransactionSerializer
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max
from django.http import JsonResponse
import math
from .filters import PropertyFilter

# Create your views here.
class PropertyListView(APIView):
    def get(self, request):
        properties = Property.objects.all()
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)
    

class PropertyDetailView(APIView):
    def get(self, request, pk):
        try:
            property = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response({'detail': 'Property not found'}, status=404)
        
        view_type = request.query_params.get('view', 'overview')
        
        if view_type == 'overview':
            serializer = PropertyOverviewSerializer(property)
        elif view_type == 'images':
            serializer = PropertyImagesSerializer(property)
        # elif view_type == 'additional':
        #     serializer = PropertyAdditionalDetailsSerializer(property)
        # elif view_type == 'financials':
        #     serializer = PropertyFinancialsSerializer(property)
        # elif view_type == 'full':
        #     serializer = PropertyFullSerializer(property)
        else:
            return Response({'detail': 'Invalid view type'}, status=400)
        
        return Response(serializer.data)

class PropertyFilterView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PropertyFilter

class UniqueLocationsView(APIView):
    def get(self, request):
        locations = Property.objects.order_by('location').values_list('location', flat=True).distinct()
        return JsonResponse(list(locations), safe=False)
    
def generate_price_range(max_price, rounding_degree, increment):
    max_price_rounded = math.ceil(max_price / rounding_degree) * rounding_degree
    price_range = list(range(0, max_price_rounded + increment, increment))
    return price_range

class PriceRangeView(APIView):
    def get(self, request):
        max_price = Property.objects.aggregate(Max('price'))['price__max']
        rounding_degree = 100000  # adjust this value as needed
        increment = 100000  # adjust this value as needed
        price_range = generate_price_range(max_price, rounding_degree, increment)
        return Response(price_range)
    
class YieldRangeView(APIView):
    def get(self, request):
        max_annual_yield = Property.objects.aggregate(Max('projected_annual_yield'))['projected_annual_yield__max'] or 0
        max_rental_yield = Property.objects.aggregate(Max('projected_rental_yield'))['projected_rental_yield__max'] or 0
        return Response({
            "max_annual_yield": max_annual_yield,
            "max_rental_yield": max_rental_yield
        })

class PropertyTypeListView(APIView):
    def get(self, request):
        property_types = Property.objects.order_by('property_type').values_list('property_type', flat=True).distinct()
        return JsonResponse(list(property_types), safe=False)
    


class TokensTransactionListCreateView(generics.ListCreateAPIView):
    queryset = TokensTransaction.objects.all()
    serializer_class = TokenTransactionSerializer

    def get_queryset(self):
        property_id = self.kwargs['property_id']
        property = get_object_or_404(Property, id=property_id)
        return TokensTransaction.objects.filter(property=property)

class TokensTransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TokensTransaction.objects.all()
    serializer_class = TokenTransactionSerializer