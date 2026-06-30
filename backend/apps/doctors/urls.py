from django.urls import path
from doctors.api.views import DoctorListView  # Siguraduhing tugma ang folder path sa views mo

urlpatterns = [
    # 🩺 Endpoint para makita ng pasyente o publiko ang mga available na doktor at schedule
    path('list/', DoctorListView.as_view(), name='doctor-list'),
]