from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import PatientRegistrationSerializer, UserProfileSerializer # Pwedeng pag-isahin ang import line na ito

class PatientRegisterView(APIView):
    # Papayagan natin ang kahit sino (kahit hindi pa naka-login) na makapag-register
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PatientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registration successful! Maaari ka nang mag-login."}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        # Ipinapasa nito ang kasalukuyang naka-login na user (request.user)
        return self.request.user