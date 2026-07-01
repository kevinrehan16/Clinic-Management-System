from rest_framework import serializers
from django.utils import timezone
from datetime import date
from appointments.models import Appointment
from doctors.models import DoctorProfile

class AppointmentCreateSerializer(serializers.ModelSerializer):
    # Kukuha lang tayo ng id ng doctor mula sa frontend POST request
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=DoctorProfile.objects.filter(is_active=True),
        source='doctor'
    )

    class Meta:
        model = Appointment
        fields = ['doctor_id', 'appointment_date', 'appointment_time', 'reason_for_visit']

    
    def validate(self, data):
        """
        Dito ginagawa ang Object-level validation.
        Tumatakbo ito pagkatapos ng field-level validation.
        """
        today = timezone.now().date()

        doctor = data.get('doctor')
        date = data.get('appointment_date')

        # 1. Validation: Hindi pwedeng mag-book sa nakalipas na oras
        if date < today:
            raise serializers.ValidationError({
                "appointment_date": "Hindi maaaring mag-book sa petsa o oras na nakalipas na."
            })

        # 2. Validation: Check kung may conflict (Double Booking)
        # Tinitignan natin kung may existing appointment na ang doctor sa oras na ito
        if Appointment.objects.filter(doctor=doctor.user, appointment_date=date).exists():
            raise serializers.ValidationError({
                "appointment_date": "Ang doctor ay may appointment na sa oras na ito. Pakipili ng ibang schedule."
            })

        return data