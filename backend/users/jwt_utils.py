import jose.jwt
from django.conf import settings
from datetime import datetime, timedelta

def create_jwt_token(user_id):
    """Crea un token JWT para el usuario"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(minutes=15),  # El token expira en 15 minutos
        'iat': datetime.utcnow(),
    }
    return jose.jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def create_refresh_token(user_id):
    """Crea un token de refresco para el usuario"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),  # El token de refresco expira en 7 días
        'iat': datetime.utcnow(),
    }
    return jose.jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_jwt_token(token):
    """Decodifica y verifica un token JWT"""
    try:
        payload = jose.jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jose.jwt.ExpiredSignatureError:
        raise Exception('Token expired. Please log in again.')
    except jose.jwt.JWTError:
        raise Exception('Invalid token. Please log in again.')

def decode_refresh_token(token):
    """Decodifica y verifica un token de refresco"""
    try:
        payload = jose.jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jose.jwt.ExpiredSignatureError:
        raise Exception('Refresh token expired. Please log in again.')
    except jose.jwt.JWTError:
        raise Exception('Invalid refresh token. Please log in again.')
