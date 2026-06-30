from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from users.models import PatientProfile

User = get_user_model()

# ==========================================
# 1. SERIALIZER PARA SA PATIENT PROFILE DETAIL
# ==========================================
# Nilagay natin ito sa unahan para kilalanin siya ng mga susunod na serializers sa ibaba
class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['birth_date', 'gender', 'blood_type']


# ==========================================
# 2. SERIALIZER PARA SA REGISTRATION
# ==========================================
class PatientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})

    # Tahasang ideklara ang mga fields na ito para tanggapin at i-validate ni DRF ang inputs mula sa frontend
    birth_date = serializers.DateField(required=True, allow_null=False)
    gender = serializers.CharField(required=False, allow_blank=True, default='')
    blood_type = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 
            'first_name', 'last_name', 'birth_date', 'gender', 'blood_type'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Hindi magkatugma ang password at confirm password."})
        return attrs

    def create(self, validated_data):
        # Tanggalin ang mga pang-confirm at profile fields para hindi mag-error sa create_user()
        validated_data.pop('password_confirm', None)
        
        # Sigurado nang may laman ito dahil dumaan sa validation sa taas
        birth_date = validated_data.pop('birth_date')
        gender = validated_data.pop('gender', '')
        blood_type = validated_data.pop('blood_type', '')
        
        with transaction.atomic():
            # 1. Gagawa muna ng User instance
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role=User.Roles.PATIENT 
            )
            
            # 2. Awtomatikong ikakabit at gagawan ng PatientProfile
            PatientProfile.objects.create(
                user=user,
                birth_date=birth_date,
                gender=gender,
                blood_type=blood_type
            )
            
        return user


# ==========================================
# 3. SERIALIZER PARA SA BUONG PROFILE VIEW (USER + PROFILE)
# ==========================================
class UserProfileSerializer(serializers.ModelSerializer):
    # Ginawa nating read_only=False ang PatientProfileSerializer para makatanggap ng data pabalik
    profile_details = PatientProfileSerializer(source='patient_profile', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_details']
        # I-set natin ang username at email bilang read_only kung ayaw mong ipabago ng pasyente ang login credentials nila
        read_only_fields = ['id', 'username', 'email', 'role']

    def update(self, instance, validated_data):
        # 1. I-extract ang profile data mula sa validated data
        profile_data = validated_data.pop('patient_profile', None)

        # 2. I-update ang mga fields ng User model (first_name, last_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # 3. I-update naman ang nakakabit na PatientProfile
        if profile_data:
            profile_instance = instance.patient_profile
            profile_instance.birth_date = profile_data.get('birth_date', profile_instance.birth_date)
            profile_instance.gender = profile_data.get('gender', profile_instance.gender)
            profile_instance.blood_type = profile_data.get('blood_type', profile_instance.blood_type)
            profile_instance.save()

        return instance