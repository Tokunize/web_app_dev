from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from .jwt_utils import decode_jwt_token

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # El header de autorización debe tener el formato "Bearer <token>"
            token = auth_header.split(' ')[1]
        except IndexError:
            raise AuthenticationFailed('Authorization header is invalid.')

        try:
            payload = decode_jwt_token(token)
        except Exception as e:
            raise AuthenticationFailed(str(e))

        user_id = payload.get('user_id')
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')

        return (user, token)
