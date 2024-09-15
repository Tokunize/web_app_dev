from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, InvestorProfile, PropertyOwnerProfile
from .serializers import CustomUserSerializer
from rest_framework import status
from .authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .utils import get_total_invested, get_total_tokens_owned

class SyncUserView(APIView):
    authentication_classes = [Auth0JWTAuthentication]

    def post(self, request):
        # The user is already authenticated by the time we reach this point
        user = request.user  # This is the CustomUser that was either created or fetched
        print(user.id, "ussserr")

        # Get additional data from the frontend
        email = request.data.get('email', user.email)
        name = request.data.get('name', user.name)
        role = request.data.get('role', 'investor')  # Default role is 'investor'

        # Update the user's email and name if they were passed from the frontend
        user.email = email
        user.name = name
        user.rol = role
        user.save()

        # Create a profile based on the role if it doesn't already exist
        if role == 'owner':
            PropertyOwnerProfile.objects.get_or_create(user=user)
        elif role == 'investor':
            InvestorProfile.objects.get_or_create(user=user)

        # Serialize and return the user data
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        

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


class UserInvestmentSummaryAPIView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        total_invested = get_total_invested(user)
        total_tokens_owned = get_total_tokens_owned(user)
        
        data = {
            'total_invested': str(total_invested),  # Convertir a string para evitar problemas con la serialización de Decimal
            'total_tokens_owned': total_tokens_owned
        }
        
        return Response(data, status=status.HTTP_200_OK)