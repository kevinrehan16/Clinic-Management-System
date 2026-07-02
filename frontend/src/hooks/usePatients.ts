import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, registerPatient, type Patient } from '../services/patientService';

export const usePatients = () => {
  return useQuery<Patient[], Error>({
    queryKey: ['patients'], // Ito ang cache key mo
    queryFn: getPatients,
    staleTime: 1000 * 60 * 5, // Optional: 5 minutes bago mag-isip na luma na ang data
  });
};

export const useRegisterPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      // Invalidate para mag-refresh ang listahan ng patients pagkatapos mag-add
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  });
};