from django.db import models
from django.conf import settings
from common.base_models import BaseModel

# 1. Siguraduhing nasa itaas ang PatientProfile para ma-reference siya ng ibang models
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
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='patient_profile',
        limit_choices_to={'role': 'PATIENT'}
    )
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')])
    blood_type = models.CharField(max_length=7, choices=BLOOD_TYPES, default='UNKNOWN')
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    emergency_relationship = models.CharField(max_length=50, blank=True, null=True)
    medical_notes = models.TextField(blank=True, null=True, help_text="Allergies or chronic conditions")
    suffix = models.CharField(max_length=10, blank=True, null=True)
    civil_status = models.CharField(
        max_length=20, 
        choices=[
            ('Single', 'Single'),
            ('Married', 'Married'),
            ('Widowed', 'Widowed'),
            ('Divorced', 'Divorced'),
            ('Separated', 'Separated')
        ],
        blank=True, null=True
    )
    occupation = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=50, default='Filipino', blank=True, null=True)
    land_line = models.CharField(max_length=20, blank=True, null=True)
    # --- PHILIPPINE ADDRESS SYSTEM ---
    address_info = models.CharField(max_length=255, blank=True, null=True) # House No., Street Name
    brgy = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    # --- GOVERNMENT & INSURANCE IDs ---
    phil_health = models.CharField(max_length=20, blank=True, null=True)
    senior_id = models.CharField(max_length=20, blank=True, null=True)
    hmo_provider = models.CharField(max_length=100, blank=True, null=True) # e.g., Maxicare, MediCard
    hmo_accnum = models.CharField(max_length=50, blank=True, null=True) # HMO Account/Policy Number


    class Meta:
        db_table = 'patient_profiles'

    def __str__(self):
        return f"{self.user.get_full_name()} {self.suffix or ''}".strip()


class PatientMedicalHistory(BaseModel):
    # 2. Gamitin ang string 'PatientProfile' para maiwasan ang circular import issues
    patient = models.ForeignKey(
        'PatientProfile', 
        on_delete=models.CASCADE, 
        related_name='medical_histories'
    )
    condition_name = models.CharField(max_length=150, db_index=True)
    diagnosis_date = models.DateField(blank=True, null=True)
    treatment_received = models.TextField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'patient_medical_histories'
        verbose_name = 'Patient Medical History'

    def __str__(self):
        # Access sa user via patient.user
        return f"{self.patient.user.get_full_name()} - {self.condition_name}"


class PatientAllergy(BaseModel):
    SEVERITY_CHOICES = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Moderate'),
        ('HIGH', 'Severe / Life Threatening')
    ]

    patient = models.ForeignKey(
        'PatientProfile', 
        on_delete=models.CASCADE, 
        related_name='allergies'
    )
    allergen = models.CharField(max_length=100, db_index=True)
    reaction = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='LOW')

    class Meta:
        db_table = 'patient_allergies'
        verbose_name = 'Patient Allergy'
        verbose_name_plural = 'Patient Allergies'

    def __str__(self):
        return f"{self.patient.user.get_full_name()} - {self.allergen}"