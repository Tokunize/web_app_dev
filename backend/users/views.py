from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, InvestorProfile, PropertyOwnerProfile,SubmitApplication
from .serializers import CustomUserSerializer,ApplicationSubmitSerializer
from rest_framework import status
from .authentication import Auth0JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
import json

from django.http import JsonResponse

@csrf_exempt

def hola_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        email = data.get('email', 'No email provideddd')
        name = data.get('name', 'No name provided')
        role = data.get('role', 'No role provided')

            # Imprimir o registrar los datos (aquí usaremos print para debug)
        print(f"Email: {email}, Name: {name}, Role: {role}")

        return JsonResponse({'message': 'Hola'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
 


class SyncUserView(APIView):
    authentication_classes = [Auth0JWTAuthentication]

    def post(self, request):
        # The user is already authenticated by the time we reach this point
        user = request.user  # This is the CustomUser that was either created or fetched

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



#VIEW TO APPLICATION SUBMIT
class ApplicationSubmitListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # Obtener todas las aplicaciones de un usuario
    def get(self, request):
        user_id = request.user.id

        try:
            # Usamos `filter()` para obtener todas las aplicaciones del usuario
            applications = SubmitApplication.objects.filter(user_id=user_id)            
            if not applications.exists():
                return Response({"message": "No applications found for this user."}, status=status.HTTP_404_NOT_FOUND)

            # Serializamos las aplicaciones
            serializer = ApplicationSubmitSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Capturamos cualquier error no esperado y lo reportamos
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Crear una nueva aplicación
    def post(self, request):
        request.data['user'] = request.user.id
        serializer = ApplicationSubmitSerializer(data=request.data)
        if serializer.is_valid():
            # Si los datos son válidos, crea la solicitud de aplicación
            serializer.save()
            # Devuelve la respuesta con los datos de la solicitud creada
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Si los datos no son válidos, devuelve un error con los detalles
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    # Actualizar una aplicación existente
    def put(self, request, reference_number):
        try:
            # Recupera la solicitud de aplicación usando el reference_number (uuid)
            application = SubmitApplication.objects.get(reference_number=reference_number)

        except SubmitApplication.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializa los datos con los nuevos datos enviados en la solicitud
        serializer = ApplicationSubmitSerializer(application, data=request.data, partial=True)

        if serializer.is_valid():
            # Guarda los cambios de la solicitud
            serializer.save()

            # Devuelve la respuesta con los datos actualizados
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Si los datos no son válidos, devuelve un error con los detalles
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Obtener una aplicación específica usando el reference_number
    def get(self, request, reference_number=None):
        try:
            # Recupera la solicitud de aplicación usando el reference_number (uuid)
            application = SubmitApplication.objects.get(reference_number=reference_number)

            # Serializa la solicitud de aplicación encontrada
            serializer = ApplicationSubmitSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except SubmitApplication.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
