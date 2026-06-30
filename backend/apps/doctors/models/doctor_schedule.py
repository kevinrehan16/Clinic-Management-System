from django.db import models
from .doctor_profile import DoctorProfile # I-import ang kapapanganak lang na profile model natin

class DoctorSchedule(models.Model):
    class DaysOfWeek(models.TextChoices):
        MONDAY = 'MON', 'Monday'
        TUESDAY = 'TUE', 'Tuesday'
        WEDNESDAY = 'WED', 'Wednesday'
        THURSDAY = 'THU', 'Thursday'
        FRIDAY = 'FRI', 'Friday'
        SATURDAY = 'SAT', 'Saturday'
        SUNDAY = 'SUN', 'Sunday'

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=3, choices=DaysOfWeek.choices)
    start_time = models.TimeField(help_text="Format: HH:MM:SS (e.g., 09:00:00)")
    end_time = models.TimeField(help_text="Format: HH:MM:SS (e.g., 17:00:00)")
    max_patients = models.PositiveIntegerField(default=10)

    class Meta:
        unique_together = ('doctor', 'day_of_week', 'start_time')
        db_table = 'doctor_schedules'

    def __str__(self):
        return f"{self.doctor} | {self.get_day_of_week_display()} ({self.start_time} - {self.end_time})"