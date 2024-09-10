from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from property.models import Property, TokensTransaction
from .serializers import PropertySerializerList,AllDetailsPropertySerializer, PropertyOverviewSerializer,PropertyImagesSerializer,TokenTransactionSerializer, CreatePropertySerializer,PropertyFinancialsSerializer
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max
from users.models import PropertyOwnerProfile

from django.http import JsonResponse
import math
from .filters import PropertyFilter
from users.authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny,BasePermission


class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        if request.user_role== 'admin':
            return True
        if request.user_role == 'owner':
            return True
        return False
    
class PropertyListView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        user_role = getattr(request, 'user_role', None)
        user_id = request.user.id
        
        if user_role == 'admin':
            properties = Property.objects.all()
        elif user_role == 'owner':
            try:
                profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            except PropertyOwnerProfile.DoesNotExist:
                return Response({'error': 'Profile not found'}, status=404)

            properties = Property.objects.filter(owner_profile=profile.id).exclude()
        else:
            return Response({'error': 'Unauthorized'}, status=401)
        
        serializer = PropertySerializerList(properties, many=True)
        return Response(serializer.data)
    

class PublicPropertyList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        properties = Property.objects.exclude(status='under_review')        
        serializer = PropertySerializerList(properties, many=True)        
        return Response(serializer.data)
    

class ConditionalPermissionMixin:
    def get_permissions(self):
        view_type = self.request.query_params.get('view', 'overview')
        if view_type == 'overview' or view_type == 'images':
            return [AllowAny()]
        return [IsAuthenticated()]

class PropertyDetailView(ConditionalPermissionMixin, APIView):
    authentication_classes = [Auth0JWTAuthentication]
    
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
        elif view_type == 'financial':
            serializer = PropertyFinancialsSerializer(property)
        elif view_type == 'all':
            serializer = AllDetailsPropertySerializer(property)
        else:
            return Response({'detail': 'Invalid view type'}, status=400)
        
        return Response(serializer.data)

class PropertyFilterView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializerList
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PropertyFilter


class PropertyCreateUpdateView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        # Get the data from the request
        data = request.data
        
        user_id = request.user.id
        # Now, find the PropertyOwnerProfile using the user_id
        try:
            owner_profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            print(f"Owner Profile found: ID {owner_profile.id} for user ID {user_id}")
        except PropertyOwnerProfile.DoesNotExist:
            return Response({'error': f'Owner profile not found for user ID {user_id}.'}, status=404)
        
        data['owner_profile'] = owner_profile.id
        # Initialize the serializer with the data from the request
        serializer = CreatePropertySerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            print("Serializer valid, proceeding...")

            if 'owner' in request.user.rol:
                print("User role: owner")

                property_id = data.get('id')  
                property_instance, created = Property.objects.update_or_create(
                    id=property_id,
                    defaults={**serializer.validated_data, 'owner_profile': owner_profile, 'owner_fields_completed': True}
                )
                return Response({'message': 'Property data saved successfully. Awaiting admin review.'}, status=200)

            elif 'admin' in request.user.rol:
                print("User role: admin")

                property_id = data.get('id')
                try:
                    property_instance = Property.objects.get(id=property_id)
                except Property.DoesNotExist:
                    return Response({'error': 'Property not found.'}, status=404)

                if not property_instance.owner_fields_completed:
                    return Response({'error': 'Owner fields must be completed before admin can add data.'}, status=400)

                # Update property with admin fields
                for field in serializer.validated_data:
                    setattr(property_instance, field, serializer.validated_data[field])
                property_instance.admin_fields_completed = True
                property_instance.save()

                return Response({'message': 'Property updated successfully by admin.'}, status=200)

        # If serializer is not valid, return errors
        return Response(serializer.errors, status=400)



#VIEWS FOR THE TRANSACCTIONS MODEL CRUD OPERATIONS
class TokensTransactionListCreateView(generics.ListCreateAPIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = TokensTransaction.objects.all()
    serializer_class = TokenTransactionSerializer

    def get_queryset(self):
        property_id = self.kwargs['property_id']
        property = get_object_or_404(Property, id=property_id)
        return TokensTransaction.objects.filter(property=property)

class TokensTransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = TokensTransaction.objects.all()
    serializer_class = TokenTransactionSerializer









#views that maybe we dont need but still there just in case
    
# class UniqueLocationsView(APIView):
#     def get(self, request):
#         locations = Property.objects.order_by('location').values_list('location', flat=True).distinct()
#         return JsonResponse(list(locations), safe=False)
    
# def generate_price_range(max_price, rounding_degree, increment):
#     max_price_rounded = math.ceil(max_price / rounding_degree) * rounding_degree
#     price_range = list(range(0, max_price_rounded + increment, increment))
#     return price_range

# class PriceRangeView(APIView):
#     def get(self, request):
#         max_price = Property.objects.aggregate(Max('price'))['price__max']
#         rounding_degree = 100000  # adjust this value as needed
#         increment = 100000  # adjust this value as needed
#         price_range = generate_price_range(max_price, rounding_degree, increment)
#         return Response(price_range)
    
# class YieldRangeView(APIView):
#     def get(self, request):
#         max_annual_yield = Property.objects.aggregate(Max('projected_annual_yield'))['projected_annual_yield__max'] or 0
#         max_rental_yield = Property.objects.aggregate(Max('projected_rental_yield'))['projected_rental_yield__max'] or 0
#         return Response({
#             "max_annual_yield": max_annual_yield,
#             "max_rental_yield": max_rental_yield
#         })

# class PropertyTypeListView(APIView):
#     def get(self, request):
#         property_types = Property.objects.order_by('property_type').values_list('property_type', flat=True).distinct()
#         return JsonResponse(list(property_types), safe=False)
    


