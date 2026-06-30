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

    def create(self, validated_data):
        # 1. Kunin ang request user (patient)
        request = self.context.get('request')
        validated_data['patient'] = request.user
        
        # 2. Kunin ang 'doctor' object mula sa validated_data 
        # (ito yung DoctorProfile na nakuha ng PrimaryKeyRelatedField)
        doctor_profile = validated_data.get('doctor')
        
        # 3. I-reassign ang 'doctor' field gamit ang user ng doctor_profile
        if doctor_profile:
            validated_data['doctor'] = doctor_profile.user
            
        return super().create(validated_data)