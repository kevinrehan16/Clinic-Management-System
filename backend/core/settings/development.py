import os
from .base import * # I-import lahat ng generic settings mula sa base.py

# Siguraduhin na True ang Debug sa development
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Localized Development Database
# Pwedeng palitan ng PostgreSQL mamaya sa production.py nang walang binabago sa base architecture
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'clinic_db',                  # Pangalan ng database na ginawa mo sa Postgres
        'USER': 'postgres',                   # Default Postgres username
        'PASSWORD': 'g@tes2009',              # Ipalit mo ang totoong password mo
        'HOST': 'localhost',                  # Dahil nasa local machine mo ang Postgres
        'PORT': '5432',                       # Default port ng Postgres
    }
}

# Development Email Backend (Mag-pi-print lang sa console ang emails sa halip na totoong mag-send)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CORS Settings para sa Front-end connection (e.g., React, Vue, o Next.js)
CORS_ALLOW_ALL_ORIGINS = True 

print("--- DEVELOPMENT SETTINGS LOADED SUCCESSFULLY ---")