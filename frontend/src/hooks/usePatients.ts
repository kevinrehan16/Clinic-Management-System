import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// I-import natin ang 'patientService' imbes na yung individual functions
import { patientService, type Patient } from '../services/patientService';

export const usePatients = () => {
  return useQuery<Patient[], Error>({
    queryKey: ['patients'],
    queryFn: patientService.getPatients, // Gagamitin na natin ang method mula sa object
    staleTime: 1000 * 60 * 5,
  });
};

// Bagong hook para sa single patient (View Profile)
export const usePatientDetails = (patientId: string | null) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatientById(patientId!),
    enabled: !!patientId, // Tatakbo lang kapag may ID
  });
};

export const useRegisterPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientService.registerPatient, // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      patientService.updatePatient(id, data),
    onSuccess: (data, variables) => {
      // I-invalidate ang list at ang specific patient detail
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
    },
    onError: (error: any) => {
      console.error("Updating failed:", error.response?.data || error.message);
    }
  });
};