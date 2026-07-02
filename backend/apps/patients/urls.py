from django.urls import path
from .api.views import PatientAllergyListCreateView, PatientMedicalHistoryListCreateView, PatientListCreateView

urlpatterns = [
    path('allergies/', PatientAllergyListCreateView.as_view(), name='allergy-list'),
    path('medical-histories/', PatientMedicalHistoryListCreateView.as_view(), name='history-list'),
    path('list/', PatientListCreateView.as_view(), name='patient-list'),
]