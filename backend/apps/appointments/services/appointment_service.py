# apps/appointments/services/appointment_service.py
from ..models import Appointment
from django.core.exceptions import ValidationError

def create_appointment(user, validated_data):
    # Dito ang business logic (assigning, checking, saving)
    doctor_profile = validated_data.pop('doctor') # Galing sa PrimaryKeyRelatedField
    
    appointment = Appointment.objects.create(
        patient=user,
        doctor=doctor_profile.user,
        **validated_data
    )
    return appointment