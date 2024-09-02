from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate
from .jwt_utils import create_jwt_token, create_refresh_token,decode_jwt_token
from rest_framework import status

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        # Autenticación del usuario
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Crear JWT y refresh token para el usuario
        jwt_token = create_jwt_token(user.id)
        refresh_token = create_refresh_token(user.id)
        return Response({'jwt_token': jwt_token, 'refresh_token': refresh_token}, status=status.HTTP_200_OK)

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if refresh_token is None:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = decode_jwt_token(refresh_token)
            user_id = payload['user_id']
            # Crear un nuevo JWT para el usuario
            jwt_token = create_jwt_token(user_id)
            return Response({'jwt_token': jwt_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
#CREATE A NEW USER AND BASED ON THE ROLE CREATE A PROFILE WITH THE SPECIFICATIONS
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


#PUT,GET,DELETE A USER
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


#TO FETCH ALL THE USERS
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


#maybe not necessary just to fetch the indifividual profile
class UserProfileView(APIView):
    # authentication_classes = [SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
