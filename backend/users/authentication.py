# from rest_framework import authentication
# from rest_framework.exceptions import AuthenticationFailed
# from jose import jwt, jwk

# import requests
# from users.models import CustomUser
# class Auth0JWTAuthentication(authentication.BaseAuthentication):

#     def authenticate(self, request):
#         auth = request.headers.get('Authorization', None)
#         if not auth:
#             return None

#         try:
#             parts = auth.split()

#             if parts[0].lower() != 'bearer':
#                 raise AuthenticationFailed('Authorization header must start with Bearer')
#             elif len(parts) == 1:
#                 raise AuthenticationFailed('Token not found')
#             elif len(parts) > 2:
#                 raise AuthenticationFailed('Authorization header must be Bearer token')

#             token = parts[1]
#             return self.authenticate_jwt(token)
#         except Exception as e:
#             raise AuthenticationFailed(f'Token authentication failed: {str(e)}')
    
#     def authenticate_jwt(self, token):
#     # Obtén la clave pública de Auth0
#         jwks_url = 'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/.well-known/jwks.json'
#         response = requests.get(jwks_url)
#         response.raise_for_status()
#         jwks = response.json()

#         # Extrae el kid del token
#         header = jwt.get_unverified_header(token)
#         kid = header.get('kid')
#         if not kid:
#             raise AuthenticationFailed('Invalid token header. No kid found.')

#         # Encuentra la clave pública correspondiente
#         public_key = None
#         for key in jwks['keys']:
#             if key['kid'] == kid:
#                 public_key = jwk.construct(key)
#                 break

#         if not public_key:
#             raise AuthenticationFailed('Public key not found.')

#         # Decodifica el JWT
#         try:
#             decoded_token = jwt.decode(token, public_key, algorithms=['RS256'], audience='https://my-endpoints/users')
#             print(decoded_token)
#             # Devuelve el payload del token y el token mismo
#             user_id = decoded_token.get('sub')
#             if user_id is None:
#                 raise AuthenticationFailed('Token does not contain user id (sub).')
        
#             print("aaaveeee", user_id)

#             user = CustomUser.objects.filter(sub=user_id).first()
#             if user is None:
#                 raise AuthenticationFailed('User not found.')

#             # Devuelve el usuario y el token
        


#             return ( user, token )
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Token expired.')
#         except jwt.JWTClaimsError:
#             raise AuthenticationFailed('Incorrect claims, please check the audience and issuer.')
#         except Exception as e:
#             raise AuthenticationFailed(f'Unable to parse authentication token: {str(e)}')

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from jose import jwt, jwk
import requests
from users.models import CustomUser

class Auth0JWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return None

        try:
            parts = auth.split()

            if parts[0].lower() != 'bearer':
                raise AuthenticationFailed('Authorization header must start with Bearer')
            elif len(parts) == 1:
                raise AuthenticationFailed('Token not found')
            elif len(parts) > 2:
                raise AuthenticationFailed('Authorization header must be Bearer token')

            token = parts[1]
            return self.authenticate_jwt(token,request)
        except Exception as e:
            raise AuthenticationFailed(f'Token authentication failed: {str(e)}')
    
    def authenticate_jwt(self, token,request):
        # Fetch the public key from Auth0
        jwks_url = 'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/.well-known/jwks.json'
        response = requests.get(jwks_url)
        response.raise_for_status()
        jwks = response.json()

        # Extract the kid from the token
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')
        if not kid:
            raise AuthenticationFailed('Invalid token header. No kid found.')

        # Find the public key
        public_key = None
        for key in jwks['keys']:
            if key['kid'] == kid:
                public_key = jwk.construct(key)
                break

        if not public_key:
            raise AuthenticationFailed('Public key not found.')

        # Decode the JWT
        try:
            decoded_token = jwt.decode(token, public_key, algorithms=['RS256'], audience='https://my-endpoints/users')
            user_sub = decoded_token.get('sub')

            if not user_sub:
                raise AuthenticationFailed('Token does not contain user id (sub).')

            # Check if the user exists in the database, if not, create them
            user, created = CustomUser.objects.get_or_create(
                sub=user_sub,
                defaults={
                    'email': decoded_token.get('email', ''),
                    'name': decoded_token.get('name', ''),
                    'rol': decoded_token.get('https://tokunize.com/role', '')  # Add this line

                    # Add any other fields from the token if needed
                }
            )

            request.user_role = decoded_token.get('https://tokunize.com/role', '')
            # request.user_role = user_rol
            # request.user_id = user_sub
            return (user, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired.')
        except jwt.JWTClaimsError:
            raise AuthenticationFailed('Incorrect claims, please check the audience and issuer.')
        except Exception as e:
            raise AuthenticationFailed(f'Unable to parse authentication token: {str(e)}')
