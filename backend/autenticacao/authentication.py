"""
Autenticação JWT via cookie para o ParticipeMais.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

class CookieJWTAuthentication(JWTAuthentication):
    """
    Autenticação JWT baseada em cookie 'access_token'.
    """
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')
        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
        except InvalidToken:
            return None

        return self.get_user(validated_token), validated_token
