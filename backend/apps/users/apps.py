from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'  # Dahil ginawa na natin ang path manipulation sa settings, 'users' lang ang ilalagay dito.