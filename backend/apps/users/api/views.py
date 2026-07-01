from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import PatientRegistrationSerializer, UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate

class PatientRegisterView(APIView):
    # Papayagan natin ang kahit sino (kahit hindi pa naka-login) na makapag-register
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PatientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registration successful! Maaari ka nang mag-login."}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        # Ipinapasa nito ang kasalukuyang naka-login na user (request.user)
        return self.request.user
    

class AuthMeView(APIView):
    # Protektado ito, kapag pumasok ang request, dadaan muna ito sa CookieJWTAuthentication natin
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Kung nakalagpas dito, ibig sabihin valid ang cookie ng user
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        }, status=status.HTTP_200_OK)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # 1. I-generate ang JWT tokens para sa user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            
            # 2. Isaksak ang Access Token sa Cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
            )
            
            # 3. Isaksak ang Refresh Token sa Cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
            )
            
            return response
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        
        # Burahin ang mga cookies sa browser sa pamamagitan ng pag-expire sa kanila agad
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'])
        
        return response