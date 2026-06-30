from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from doctors.models import DoctorProfile  # Tiyaking tama ang import ng model mo
from doctors.serializers.doctor_list_serializers import DoctorListSerializer # Kung ito ang pinangalan natin sa serializer

class DoctorListView(ListAPIView):
    # Kahit sino (pasyente o publiko) pwedeng makita ang listahan ng mga doktor
    permission_classes = [AllowAny]
    serializer_class = DoctorListSerializer
    
    def get_queryset(self):
        # Kukunin lang ang mga active na doktor at io-optimize ang database queries
        return DoctorProfile.objects.filter(is_active=True).select_related('user').prefetch_related('schedules')