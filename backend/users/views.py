from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser,InvestorProfile,PropertyOwnerProfile
from .serializers import CustomUserSerializer
from rest_framework import status
from .authentication import Auth0JWTAuthentication


#CREATE OR UPDATE A USER COMING FROM AUTH0 AND ASSING  A PROFILE BASE ON THE ROLE 
class SyncUserView(APIView):
    authentication_classes = [Auth0JWTAuthentication]

    def post(self, request):
        # OBTAIN THE PAYLOAD FROM THE AUTH0 
        user_sub = request.user.get('sub', None)  # GET THE SUB FROM THE PAYLOAD

        if not user_sub:
            return Response({'error': 'Sub claim missing from authenticated user'}, status=status.HTTP_400_BAD_REQUEST)

        # GET THE ATRIBUTES FROM THE FRONTEND
        email = request.data.get('email')
        name = request.data.get('name')
        role = request.data.get('role', 'investor')  #By defult will be a investor

        if not email or not name:
            return Response({'error': 'Missing user information in request body'}, status=status.HTTP_400_BAD_REQUEST)

        # CREATE OR UPDATE A USER COMING FROM AUTH0 IN OUR CUSTOMER MODEL
        user, created = CustomUser.objects.update_or_create(
            sub=user_sub,  # we use the unique auth0 sub to link with our model
            defaults={
                'email': email,
                'name': name,
                'rol': role,
            }
        )

        # CREATE A PROFILE BASED ON THE ROLE THEY HAVE
        if role == 'owner':
            PropertyOwnerProfile.objects.get_or_create(user=user)
        elif role == 'investor':
            InvestorProfile.objects.get_or_create(user=user)
        # elif role == 'property_admin':
        #     PropertyOwner.objects.get_or_create(user=user)

        serializer = CustomUserSerializer(user)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)
        
        

# GET, UPDATE, DELETE USER FROM OUR DATABASE
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


# Para listar todos los usuarios
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


# Vista para obtener el perfil del usuario autenticado
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

