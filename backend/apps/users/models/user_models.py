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

    REQUIRED_FIELDS = ['email', 'role']

    class Meta:
        db_table = 'auth_users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"


# class DoctorProfile(BaseModel):
#     """
#     Spesipikong impormasyon para lamang sa mga Doctor.
#     Naka-link sa Main User via OneToOneField.
#     """
#     user = models.OneToOneField(
#         User, 
#         on_delete=models.CASCADE, 
#         related_name='doctor_profile',
#         limit_choices_to={'role': User.Roles.DOCTOR}
#     )
#     license_number = models.CharField(max_length=50, unique=True)
#     specialization = models.CharField(max_length=100, db_index=True)
#     ptr_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="PTR Number")
#     clinic_hours = models.JSONField(default=dict, help_text="e.g., {'Monday': '9AM-5PM'}")
#     is_active_practitioner = models.BooleanField(default=True)

#     class Meta:
#         db_table = 'doctor_profiles'

#     def __str__(self):
#         return f"Dr. {self.user.get_full_name()} - {self.specialization}"


class PatientProfile(BaseModel):
    """
    Spesipikong impormasyon para lamang sa mga Pasyente.
    """
    BLOOD_TYPES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
        ('UNKNOWN', 'Unknown')
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='patient_profile',
        limit_choices_to={'role': User.Roles.PATIENT}
    )
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')])
    blood_type = models.CharField(max_length=7, choices=BLOOD_TYPES, default='UNKNOWN')
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    medical_notes = models.TextField(blank=True, null=True, help_text="Allergies or chronic conditions")

    class Meta:
        db_table = 'patient_profiles'

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"