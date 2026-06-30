from django.urls import path
from appointments.api.views import PatientAppointmentView  # Siguraduhing tugma ang folder path sa views mo

urlpatterns = [
    # 📅 Endpoint para mag-book at makita ng kasalukuyang user ang kanyang mga appointments
    path('my-appointments/', PatientAppointmentView.as_view(), name='patient-appointments'),
    path('', PatientAppointmentView.as_view(), name='appointment-list-create'),
]