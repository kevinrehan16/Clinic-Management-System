from django.contrib.auth.models import AbstractUser
from django.db import models
from common.base_models import BaseModel

class User(AbstractUser, BaseModel):
    """
    Ang pinakapundasyon ng Authentication sa buong system.
    Gumagamit ng custom roles para sa granular access control.
    """
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrator'
        DOCTOR = 'DOCTOR', 'Doctor'
        STAFF = 'STAFF', 'Clinic Staff'
        PATIENT = 'PATIENT', 'Patient'

    role = models.CharField(
        max_length=20, 
        choices=Roles.choices, 
        default=Roles.STAFF,
        db_index=True
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Siguraduhin na ang email ay part ng REQUIRED_FIELDS kung gagamitin mo ito bilang identifier
    REQUIRED_FIELDS = ['email', 'role']

    class Meta:
        db_table = 'auth_users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"

# Note: Inalis na natin ang PatientProfile dito para maiwasan ang migration errors.
# Siguraduhin na ang PatientProfile ay define lang sa loob ng apps/patients/models/