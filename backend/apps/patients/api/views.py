from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import PatientAllergy, PatientMedicalHistory, PatientProfile
from ..serializers.patient_serializer import PatientAllergySerializer, PatientMedicalHistorySerializer, PatientSerializer

class PatientAllergyListCreateView(generics.ListCreateAPIView):
    queryset = PatientAllergy.objects.all()
    serializer_class = PatientAllergySerializer
    permission_classes = [IsAuthenticated]

class PatientMedicalHistoryListCreateView(generics.ListCreateAPIView):
    queryset = PatientMedicalHistory.objects.all()
    serializer_class = PatientMedicalHistorySerializer
    permission_classes = [IsAuthenticated]

class PatientListCreateView(generics.ListCreateAPIView):
    # I-query ang patient_profiles at i-join ang user data
    queryset = PatientProfile.objects.select_related('user').all()
    serializer_class = PatientSerializer