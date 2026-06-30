from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from appointments.models import Appointment
from appointments.serializers.appointment_serializers import AppointmentCreateSerializer

class PatientAppointmentView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get_queryset(self):
        return Appointment.objects.filter(
            # Keep your existing filters here...
        ).select_related(
            'patient', 
            'doctor'
        )
    
    def get_queryset(self):
        # ... iyong code
        return Appointment.objects.all()
    
# class PatientAppointmentView(ListCreateAPIView):
#     """
#     API endpoint that allows appointments to be viewed or created.
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = AppointmentCreateSerializer
    
#     def get_queryset(self):
#         # ... iyong code
#         return Appointment.objects.all()