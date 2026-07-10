from django.urls import path
from .api.views import PatientAllergyListCreateView, PatientMedicalHistoryListCreateView, PatientListCreateView, PatientDetailView, PatientAllergyDetailView

urlpatterns = [
    path('allergies/', PatientAllergyListCreateView.as_view(), name='allergy-list'),
    path('<uuid:patient_id>/allergies/<uuid:allergy_id>/', PatientAllergyDetailView.as_view(), name='patient-allergy-detail'),
    path('medical-histories/', PatientMedicalHistoryListCreateView.as_view(), name='history-list'),
    path('list/', PatientListCreateView.as_view(), name='patient-list'),
    path('<str:id>/', PatientDetailView.as_view(), name='patient-detail'),
]