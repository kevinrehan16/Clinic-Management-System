from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# Import spectacular views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.config if hasattr(admin.site, 'config') else admin.site.urls),
    
    # Global JWT Authentication Endpoints
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Isunod natin ang registration at user routing dito mamaya
    path('api/v1/users/', include('users.urls')),

    path('api/v1/doctors/', include('doctors.urls')),          
    path('api/v1/appointments/', include('appointments.urls')),
    path('api/v1/patients/', include('patients.urls')),

    path('api/schema/', SpectacularAPIView.as_view(authentication_classes=[]), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(authentication_classes=[], url_name='schema'), name='swagger-ui'),
]

# Pag-handle ng Media at Static uploads sa Development Environment
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)