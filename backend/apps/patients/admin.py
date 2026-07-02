from django.contrib import admin
from .models import PatientMedicalHistory, PatientAllergy, PatientProfile

# I-register lang natin ang dalawang totoong models mo
admin.site.register(PatientMedicalHistory)
admin.site.register(PatientAllergy)
admin.site.register(PatientProfile)