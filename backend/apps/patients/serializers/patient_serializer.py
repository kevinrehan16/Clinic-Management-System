from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import PatientAllergy, PatientMedicalHistory, PatientProfile

# 1. Define ang User variable
User = get_user_model()

class PatientAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAllergy
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PatientMedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientMedicalHistory
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'avatar', 'is_active', 'address', 'username']
        read_only_fields = ['username']
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
        }

class PatientSerializer(serializers.ModelSerializer):
    # DITO ANG SIKRETO: Idinagdag natin ang `source='user.<field_name>'`
    # para alam ni Django na kukunin niya ito sa related User model kapag nag-output ng data.
    email = serializers.EmailField(source='user.email', required=True, allow_blank=False)
    first_name = serializers.CharField(source='user.first_name', required=True, allow_blank=False, max_length=150)
    last_name = serializers.CharField(source='user.last_name', required=True, allow_blank=False, max_length=150)
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True, max_length=20, allow_null=True)
    avatar = serializers.ImageField(source='user.avatar', required=False, allow_null=True)
    address = serializers.CharField(source='user.address', required=False, allow_blank=True, max_length=255, allow_null=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'birth_date', 'gender', 'medical_notes', 'blood_type', 
            'emergency_contact_name', 'emergency_contact_phone',
            'first_name', 'last_name', 'phone_number', 'email', 'avatar', 'is_active', 'address', 'username',
            # --- ANG MGA BAGONG FIELDS MO ---
            'suffix', 'civil_status', 'occupation', 'nationality', 'land_line',
            'address_info', 'region', 'province', 'city', 'brgy',
            'phil_health', 'senior_id', 'hmo_provider', 'hmo_accnum', 'emergency_relationship'
        ]

    def update(self, instance, validated_data):
        # Dahil gumamit tayo ng `source='user.xxx'`, pinasok ni DRF ang mga fields na yan 
        # sa loob ng isang nested dictionary na ang susi ay 'user'.
        user_data = validated_data.pop('user', {})
        
        # 1. I-update ang PatientProfile fields (birth_date, gender, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # 2. I-update ang kaugnay na User fields (first_name, last_name, etc.)
        user = instance.user
        if user_data:
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
            
        return instance