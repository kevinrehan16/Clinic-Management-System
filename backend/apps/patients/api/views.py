from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ..models import PatientAllergy, PatientMedicalHistory, PatientProfile
from ..serializers.patient_serializer import PatientAllergySerializer, PatientMedicalHistorySerializer, PatientSerializer

class PatientAllergyListCreateView(generics.ListCreateAPIView):
    # queryset = PatientAllergy.objects.all()
    serializer_class = PatientAllergySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # 1. Kunin muna lahat
        queryset = PatientAllergy.objects.all()
        queryset = PatientAllergy.objects.filter(is_deleted=False)
        
        # 2. Kunin ang 'patient_id' mula sa request URL (e.g., ?patient_id=uuid)
        patient_id = self.request.query_params.get('patient_id', None)
        
        # 3. Kung may ipinasang patient_id, i-filter ang listahan
        if patient_id is not None:
            queryset = queryset.filter(patient_id=patient_id)
            
        return queryset.order_by('-created_at')

class PatientAllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientAllergySerializer
    lookup_url_kwarg = 'allergy_id' # Ito yung magiging 'pk' sa loob ng view

    def get_queryset(self):
        # I-filter ang allergy base sa patient_id na galing sa URL
        patient_id = self.kwargs.get('patient_id')
        return PatientAllergy.objects.filter(patient__id=patient_id)
    
class PatientMedicalHistoryListCreateView(generics.ListCreateAPIView):
    queryset = PatientMedicalHistory.objects.all()
    serializer_class = PatientMedicalHistorySerializer
    permission_classes = [IsAuthenticated]

class PatientListCreateView(generics.ListCreateAPIView):
    # I-query ang patient_profiles at i-join ang user data
    queryset = PatientProfile.objects.select_related('user').filter(user__role='PATIENT').order_by('-created_at')
    serializer_class = PatientSerializer

class PatientDetailView(generics.RetrieveUpdateAPIView):
    queryset = PatientProfile.objects.select_related('user').all()
    serializer_class = PatientSerializer
    lookup_field = 'id' # Ito yung field na hahanapin sa URL (e.g., /api/v1/users/patients/1/)