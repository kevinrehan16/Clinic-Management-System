from rest_framework import serializers
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