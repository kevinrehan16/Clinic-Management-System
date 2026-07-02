from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import PatientAllergy, PatientMedicalHistory, PatientProfile

# 1. Dito mo i-define ang User variable
User = get_user_model()

class PatientAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAllergy
        fields = '__all__'

class PatientMedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientMedicalHistory
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Ngayon, kilala na ng Python kung ano ang 'User'
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'avatar', 'is_active', 'address']

class PatientSerializer(serializers.ModelSerializer):
    # I-embed ang user data sa loob ng patient profile
    user = UserSerializer(read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'birth_date', 'gender', 'medical_notes', 'blood_type', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_name']