from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from rest_framework.views import APIView
from property.models import Property,Token
from .serializers import (
    PropertySerializerList,
    AllDetailsPropertySerializer,
    PropertyOverviewSerializer,
    PropertyImagesSerializer, 
    CreatePropertySerializer,
    PropertyFinancialsSerializer,
    TokenSerializer

)
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max
from users.models import PropertyOwnerProfile
from django.http import JsonResponse
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
        properties = Property.objects.exclude(status="under_review")        
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
        elif view_type == 'activity':
            serializer = PropertyFinancialsSerializer(property)
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
        data = request.data
        user_id = request.user.id
        try:
            owner_profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            print(f"Owner Profile found: ID {owner_profile.id} for user ID {user_id}")
        except PropertyOwnerProfile.DoesNotExist:
            return Response({'error': f'Owner profile not found for user ID {user_id}.'}, status=404)
        data['owner_profile'] = owner_profile.id
        serializer = CreatePropertySerializer(data=data, context={'request': request})
        if serializer.is_valid():
            if 'owner' in request.user.rol:
                print("User role: owner")
                property_instance, created = Property.objects.update_or_create(
                    id=serializer.validated_data.get('id'),  # Usar el ID si está disponible
                    defaults={**serializer.validated_data, 'owner_profile': owner_profile, 'owner_fields_completed': True}
                )
                return Response({'message': 'Property data saved successfully. Awaiting admin review.'}, status=200)
            return Response({'error': 'Only owners can create properties.'}, status=403)

        return Response(serializer.errors, status=400)

    def put(self, request):
        data = request.data
        user_id = request.user.id
        property_id = data.get('id')
        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found.'}, status=404)

        if 'admin' in request.user.rol:
            serializer = CreatePropertySerializer(property_instance, data=data, partial=True, context={'request': request})

            if serializer.is_valid():
                for field in serializer.validated_data:
                    setattr(property_instance, field, serializer.validated_data[field])
                property_instance.admin_fields_completed = True
                property_instance.save()

                return Response({'message': 'Property updated successfully by admin.'}, status=200)

            return Response(serializer.errors, status=400)

        # Si el usuario es propietario (owner)
        elif 'owner' in request.user.rol:
            try:
                owner_profile = PropertyOwnerProfile.objects.get(user_id=user_id)
            except PropertyOwnerProfile.DoesNotExist:
                return Response({'error': 'Owner profile is required for owners to update properties.'}, status=404)
            if property_instance.owner_profile != owner_profile:
                return Response({'error': 'You can only update your own properties.'}, status=403)
            data['owner_profile'] = owner_profile.id
            if property_instance.admin_fields_completed:
                return Response({'error': 'Admin fields are already completed. No further changes allowed.'}, status=400)
            serializer = CreatePropertySerializer(property_instance,  data=data, partial=True, context={'request': request})

            if serializer.is_valid():

                for field in serializer.validated_data:
                    setattr(property_instance, field, serializer.validated_data[field])
                property_instance.owner_fields_completed = True  # Se puede ajustar según la lógica que quieras aplicar
                property_instance.save()

                return Response({'message': 'Property updated successfully by owner.'}, status=200)

            return Response(serializer.errors, status=400)

        return Response({'error': 'Only admins or owners can update properties.'}, status=403)


class TokenListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TokenSerializer 

    def get(self, request):
        tokens = Token.objects.all()  # Ejemplo de obtener datos
        serializer = self.serializer_class(tokens, many=True)  # Serializamos los datos
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Aquí validamos y procesamos los datos enviados en la solicitud POST
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda el nuevo token si los datos son válidos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)