from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import PatientAllergy, PatientMedicalHistory
from ..serializers.patient_serializer import PatientAllergySerializer, PatientMedicalHistorySerializer

class PatientAllergyListCreateView(generics.ListCreateAPIView):
    queryset = PatientAllergy.objects.all()
    serializer_class = PatientAllergySerializer
    permission_classes = [IsAuthenticated]

class PatientMedicalHistoryListCreateView(generics.ListCreateAPIView):
    queryset = PatientMedicalHistory.objects.all()
    serializer_class = PatientMedicalHistorySerializer
    permission_classes = [IsAuthenticated]