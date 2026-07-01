import os
import sys
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ENTERPRISE TRICK: I-inject ang 'apps' folder sa python path para malinis ang imports
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-premium-clinic-key-2026')

DEBUG = True

ALLOWED_HOSTS = []

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',        # Kung gagawa tayo ng REST API mamaya
    'drf_spectacular',
    'corsheaders',
]

LOCAL_APPS = [
    'users.apps.UsersConfig',
    'patients.apps.PatientsConfig',
    'doctors.apps.DoctorsConfig',
    'appointments.apps.AppointmentsConfig',
    'consultations.apps.ConsultationsConfig',
    'pharmacy.apps.PharmacyConfig',
    'laboratory.apps.LaboratoryConfig',
    'billing.apps.BillingConfig',
    'notifications.apps.NotificationsConfig',
    'audit_logs.apps.AuditLogsConfig',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Ito ang URL ng React app mo
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Itinuturo nito ang global templates folder na ginawa natin sa root
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}, # Minimum 8 characters para sa premium security
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Django Rest Framework Global Configurations
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.CookieJWTAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', # Lock lahat ng endpoints by default para secure
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Premium Clinic API',
    'DESCRIPTION': 'Interactive API documentation for the Clinic backend operations.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True, # Cleaner request/response schemas
}

# Premium Simple JWT Configurations
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),     # Pwede mag-api call ang React sa loob ng 1 oras
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),        # Mananatiling naka-login ang user hanggang 7 araw
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),                   # 'Bearer <TOKEN>' ang format sa front-end
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),

    # Babasahin ni Django ang token mula sa cookie na ito kapag gumagamit ng JWTAuthentication
    'AUTH_COOKIE': 'access_token',  
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': False,     # I-True mo ito kapag naka-HTTPS (Production) na ang site mo
    'AUTH_COOKIE_HTTP_ONLY': True,   # Hinding-hindi mababasa ng JavaScript (Ito ang proteksyon sa XSS)
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',   # Proteksyon laban sa CSRF attacks
}

ROOT_URLCONF = 'core.urls'

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Manila'  # Swak sa Clinic operations sa Pinas
USE_I18N = True
USE_TZ = True

# Static & Media Files Management
STATIC_URL = 'static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model Definition
AUTH_USER_MODEL = 'users.User'