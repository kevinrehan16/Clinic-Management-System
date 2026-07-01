from django.urls import path
from .api.views import PatientRegisterView, PatientProfileUpdateView, AuthMeView, LoginView, LogoutView
# I-import ang mga built-in views ng Simple JWT para sa Authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Ang kasalukuyan mong registration endpoint
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),
    
    # 🔑 Login endpoint (Dito magse-send ng username at password ang React/Postman)
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # 🔄 Refresh token endpoint (Gagamitin kapag expired na ang access token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', PatientProfileUpdateView.as_view(), name='patient-profile'),

    path('auth/me/', AuthMeView.as_view(), name='auth_me'),
]