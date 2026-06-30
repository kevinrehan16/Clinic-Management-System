from django.urls import path
from .api.views import PatientAllergyListCreateView, PatientMedicalHistoryListCreateView

urlpatterns = [
    path('allergies/', PatientAllergyListCreateView.as_view(), name='allergy-list'),
    path('medical-histories/', PatientMedicalHistoryListCreateView.as_view(), name='history-list'),
]