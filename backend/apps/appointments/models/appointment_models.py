from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from common.base_models import BaseModel

class Appointment(BaseModel):
    """
    Ang core model para sa pag-iskedyul ng konsultasyon sa pagitan ng Pasyente at Doktor.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending Confirmation'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
        ('NOSHOW', 'No Show'),
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_appointments',
        limit_choices_to={'role': 'PATIENT'}
    )
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_appointments',
        limit_choices_to={'role': 'DOCTOR'}
    )
    appointment_date = models.DateField(db_index=True)
    appointment_time = models.TimeField()
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    reason_for_visit = models.TextField(help_text="Chief complaint o dahilan ng pagpunta ng pasyente.")
    cancellation_reason = models.TextField(blank=True, null=True, help_text="Sulat dito kung bakit kinansela ang appointment.")
    
    # Para sa queue management ng clinic
    token_number = models.PositiveIntegerField(null=True, blank=True, help_text="Queue number ng pasyente sa araw na iyon.")

    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date', 'appointment_time']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'

    def __str__(self):
        return f"Appt {self.id}: {self.patient.get_full_name()} with Dr. {self.doctor.last_name} on {self.appointment_date}"

    def clean(self):
        """
        Enterprise Guardrail: Sinisigurado nito na walang double booking 
        sa parehong oras at doktor.
        """
        if not self.appointment_date or not self.appointment_time:
            return

        # Maghanap ng kaparehong petsa at oras sa ibang active appointments ng doktor na ito
        overlapping_appointments = Appointment.objects.filter(
            doctor=self.doctor,
            appointment_date=self.appointment_date,
            appointment_time=self.appointment_time
        ).exclude(status='CANCELLED')

        # Kung nag-e-edit tayo ng existing appointment, huwag isama ang sarili sa check
        if self.pk:
            overlapping_appointments = overlapping_appointments.exclude(pk=self.pk)

        if overlapping_appointments.exists():
            raise ValidationError(
                f"Conflict Detected! Si Dr. {self.doctor.last_name} ay may naka-iskedyul na pasyente na sa ganitong oras ({self.appointment_time})."
            )