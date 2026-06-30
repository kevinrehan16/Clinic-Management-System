import uuid
from django.db import models

class BaseModel(models.Model):
    """
    Abstract Model na magsisilbing pundasyon ng lahat ng tables sa system.
    Gumagamit ng UUID bilang Primary Key para sa mas mataas na security.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False, db_index=True)  # Soft Delete feature

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        """I-override ang default delete para maging Soft Delete"""
        self.is_deleted = True
        self.save()

    def hard_delete(self, *args, **kwargs):
        """Tunay na bura kung talagang kinakailangan"""
        super().delete(*args, **kwargs)