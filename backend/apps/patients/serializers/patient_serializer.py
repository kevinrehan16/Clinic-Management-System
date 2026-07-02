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
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'avatar', 'is_active', 'address', 'username']
        read_only_fields = ['username']
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
        }

class PatientSerializer(serializers.ModelSerializer):
    # I-embed ang user data sa loob ng patient profile
    user = UserSerializer()

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'birth_date', 'gender', 'medical_notes', 'blood_type', 'emergency_contact_name', 'emergency_contact_phone']

    def update(self, instance, validated_data):
        # 1. Kunin ang user data kung present sa request
        user_data = validated_data.pop('user', None)
        
        # 2. Update ang PatientProfile fields (birth_date, gender, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # 3. Update ang User fields (first_name, last_name, etc.)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
            
        return instance