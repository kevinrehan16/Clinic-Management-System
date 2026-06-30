from django.contrib import admin
from .models import DoctorProfile, DoctorSchedule  # Kung nasaan man ang models mo

admin.site.register(DoctorProfile)
admin.site.register(DoctorSchedule)