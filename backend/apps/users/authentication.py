from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Kunin ang access token mula sa cookies imbes na sa header
        access_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
        if not access_token:
            return None
            
        # I-validate ang token gamit ang standard SimpleJWT logic
        validated_token = self.get_validated_token(access_token)
        return self.get_user(validated_token), validated_token