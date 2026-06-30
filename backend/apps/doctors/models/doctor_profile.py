from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DoctorProfile(models.Model):
    # Nakakabit sa pangunahing User model mo
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    
    specialization = models.CharField(max_length=100, help_text="Halimbawa: Pediatrician, Cardiologist")
    license_number = models.CharField(max_length=50, unique=True)
    clinic_room = models.CharField(max_length=50, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'doctor_profiles'

    def __str__(self):
        return f"Dr. {self.user.last_name} - {self.specialization}"