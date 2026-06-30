from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # I-customize natin ang view para ipakita ang role
    list_display = ('username', 'email', 'role', 'is_staff')
    
    # I-dagdag ang role sa edit form (fieldsets)
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )
    
    # I-dagdag ang role sa add form (para sa pag-gawa ng bagong user)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )