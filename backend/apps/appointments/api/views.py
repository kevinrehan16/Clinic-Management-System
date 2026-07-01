from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from appointments.models import Appointment
from appointments.serializers.appointment_serializers import AppointmentCreateSerializer
from appointments.services.appointment_service import create_appointment

class PatientAppointmentView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get_queryset(self):
        return Appointment.objects.all()

    # DITO MO ILAGAY ANG LOGIC
    def perform_create(self, serializer):
        # 1. Gumawa ng copy para hindi mabura ang 'doctor' sa original validated_data
        data_to_pass = serializer.validated_data.copy()
        
        # 2. I-call ang service gamit ang copy
        appointment = create_appointment(
            user=self.request.user, 
            validated_data=data_to_pass
        )
        
        # 3. Importante: I-set ang 'instance' para malaman ng DRF 
        # kung ano ang dapat niyang i-serialize sa response.
        serializer.instance = appointment