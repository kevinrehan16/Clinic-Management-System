from django.urls import path
from .api.views import PatientRegisterView,  PatientProfileUpdateView
# I-import ang mga built-in views ng Simple JWT para sa Authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Ang kasalukuyan mong registration endpoint
    path('register/patient/', PatientRegisterView.as_view(), name='patient-register'),
    
    # 🔑 Login endpoint (Dito magse-send ng username at password ang React/Postman)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 🔄 Refresh token endpoint (Gagamitin kapag expired na ang access token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', PatientProfileUpdateView.as_view(), name='patient-profile'),
]