from rest_framework import serializers
from django.contrib.auth import get_user_model
from doctors.models import DoctorProfile, DoctorSchedule

User = get_user_model()

class DoctorUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = DoctorSchedule
        fields = ['id', 'day_of_week', 'day_of_week_display', 'start_time', 'end_time']

class DoctorListSerializer(serializers.ModelSerializer):
    doctor_info = DoctorUserSerializer(source='user', read_only=True)
    schedules = DoctorScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ['id', 'specialization', 'clinic_room', 'bio', 'doctor_info', 'schedules']