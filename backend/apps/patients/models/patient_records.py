from django.db import models
from django.conf import settings
from common.base_models import BaseModel

class PatientMedicalHistory(BaseModel):
    """
    Talaan ng mga nakaraang sakit, operasyon, o namamanang kondisyon ng pasyente.
    """
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='medical_histories',
        limit_choices_to={'role': 'PATIENT'}
    )
    condition_name = models.CharField(max_length=150, db_index=True, help_text="e.g., Hypertension, Diabetes")
    diagnosis_date = models.DateField(blank=True, null=True)
    treatment_received = models.TextField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'patient_medical_histories'
        verbose_name = 'Patient Medical History'

    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.condition_name}"


class PatientAllergy(BaseModel):
    """
    Kritikal na impormasyon! Sinisigurado nito na walang maireresetang gamot
    na bawal sa pasyente.
    """
    SEVERITY_CHOICES = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Moderate'),
        ('HIGH', 'Severe / Life Threatening')
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='allergies'
    )
    allergen = models.CharField(max_length=100, db_index=True, help_text="e.g., Penicillin, Peanuts, Latex")
    reaction = models.TextField(help_text="Ano ang nangyayari? e.g., Rashes, Anaphylaxis")
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='LOW')

    class Meta:
        db_table = 'patient_allergies'
        verbose_name = 'Patient Allergy'
        verbose_name_plural = 'Patient Allergies'

    def __str__(self):
        return f"{self.patient.get_full_name()} - Allergy to {self.allergen} ({self.get_severity_display()})"