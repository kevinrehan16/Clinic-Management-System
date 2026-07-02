from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from patients.models.patient_records import PatientProfile

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
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)
    birth_date = serializers.DateField(required=True, allow_null=False)
    gender = serializers.CharField(required=False, allow_blank=True, default='')
    blood_type = serializers.CharField(required=False, allow_blank=True, default='')
    phone_number = serializers.CharField(required=False, allow_blank=True, default='')
    address = serializers.CharField(required=False, allow_blank=True)

    # ⚠️ MGA BAGONG FIELDS NA KAILANGANG IDEKLARA PARA HINDI TANGGALIN NI DRF:
    suffix = serializers.CharField(required=False, allow_blank=True, default='')
    civil_status = serializers.CharField(required=False, allow_blank=True, default='')
    occupation = serializers.CharField(required=False, allow_blank=True, default='')
    nationality = serializers.CharField(required=False, allow_blank=True, default='Filipino')
    land_line = serializers.CharField(required=False, allow_blank=True, default='')
    address_info = serializers.CharField(required=False, allow_blank=True, default='')
    region = serializers.CharField(required=False, allow_blank=True, default='')
    province = serializers.CharField(required=False, allow_blank=True, default='')
    city = serializers.CharField(required=False, allow_blank=True, default='')
    brgy = serializers.CharField(required=False, allow_blank=True, default='')
    phil_health = serializers.CharField(required=False, allow_blank=True, default='')
    senior_id = serializers.CharField(required=False, allow_blank=True, default='')
    hmo_provider = serializers.CharField(required=False, allow_blank=True, default='')
    hmo_accnum = serializers.CharField(required=False, allow_blank=True, default='')
    emergency_contact_name = serializers.CharField(required=False, allow_blank=True, default='')
    emergency_contact_phone = serializers.CharField(required=False, allow_blank=True, default='')
    emergency_relationship = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 
            'first_name', 'last_name', 'birth_date', 'gender', 'blood_type', 'phone_number', 'address',
            
            # ⚠️ ISAMA SILA DITO SA META FIELDS PARA PAYAGAN MAKIHALUBILO SA VALIDATED_DATA:
            'suffix', 'civil_status', 'occupation', 'nationality', 'land_line',
            'address_info', 'region', 'province', 'city', 'brgy',
            'phil_health', 'senior_id', 'hmo_provider', 'hmo_accnum',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_relationship'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Hindi magkatugma ang password at confirm password."})
        return attrs

    def create(self, validated_data):
        # Tanggalin ang mga pang-confirm para hindi mag-error sa create_user()
        validated_data.pop('password_confirm', None)
        
        # 1. Hatiin ang mga fields para sa PatientProfile (Gamit ang .pop())
        birth_date = validated_data.pop('birth_date')
        gender = validated_data.pop('gender', '')
        blood_type = validated_data.pop('blood_type', '')
        
        # --- KUNIN ANG MGA BAGONG FIELDS (May laman na ito ngayon!) ---
        suffix = validated_data.pop('suffix', '')
        civil_status = validated_data.pop('civil_status', '')
        occupation = validated_data.pop('occupation', '')
        nationality = validated_data.pop('nationality', 'Filipino')
        land_line = validated_data.pop('land_line', '')
        address_info = validated_data.pop('address_info', '')
        region = validated_data.pop('region', '')
        province = validated_data.pop('province', '')
        city = validated_data.pop('city', '')
        brgy = validated_data.pop('brgy', '')
        phil_health = validated_data.pop('phil_health', '')
        senior_id = validated_data.pop('senior_id', '')
        hmo_provider = validated_data.pop('hmo_provider', '')
        hmo_accnum = validated_data.pop('hmo_accnum', '')
        emergency_contact_name = validated_data.pop('emergency_contact_name', '')
        emergency_contact_phone = validated_data.pop('emergency_contact_phone', '')
        emergency_relationship = validated_data.pop('emergency_relationship', '')
        
        with transaction.atomic():
            # 2. Gagawa muna ng User instance (Ang matitira sa validated_data ay para sa User na lang)
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                phone_number=validated_data['phone_number'],
                address=validated_data['address'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role=User.Roles.PATIENT 
            )
            
            # 3. I-save na lahat ng fields sa PatientProfile
            PatientProfile.objects.create(
                user=user,
                birth_date=birth_date,
                gender=gender,
                blood_type=blood_type,
                
                # --- IPASA ANG MGA BAGONG FIELDS DITO ---
                suffix=suffix,
                civil_status=civil_status,
                occupation=occupation,
                nationality=nationality,
                land_line=land_line,
                address_info=address_info,
                region=region,
                province=province,
                city=city,
                brgy=brgy,
                phil_health=phil_health,
                senior_id=senior_id,
                hmo_provider=hmo_provider,
                hmo_accnum=hmo_accnum,
                emergency_contact_name=emergency_contact_name,
                emergency_contact_phone=emergency_contact_phone,
                emergency_relationship=emergency_relationship
            )
            
        return user


# ==========================================
# 3. SERIALIZER PARA SA BUONG PROFILE VIEW AND UPDATE (USER + PROFILE)
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