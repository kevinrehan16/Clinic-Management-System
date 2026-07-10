import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// I-import natin ang 'patientService' imbes na yung individual functions
import { patientService, type Patient, type Allergy } from '../services/patientService';

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

export const usePatientAllergies = (patientId: string | undefined) => {
  return useQuery<Allergy[], Error>({
    queryKey: ['patient-allergies', patientId],
    queryFn: () => patientService.getPatientAllergies(patientId!), 
    enabled: !!patientId && patientId !== 'undefined',
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // Magandang idagdag din ito para iwas rate-limit sa dev mode
  });
};

export const useAddAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientService.insertAllergy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-allergies'] });
    },
    onError: (error) => {
      console.error("Failed to add allergy:", error);
    }
  });
};

export const useAllergyQuery = (patientId: string, allergyId: string) => {
  return useQuery({
    queryKey: ['patient-selected-allergy', patientId, allergyId],
    queryFn: () => patientService.getPatientAllergy(patientId, allergyId),
    enabled: !!patientId && !!allergyId, // Tumatakbo lang kung may ID
  });
};

export const useUpdateAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Wrap the service method so the mutation receives a single variables object
    mutationFn: ({ patientId, allergyId, data }: { patientId: string; allergyId: string; data: any }) =>
      patientService.updateAllergy(patientId, allergyId, data),
    onSuccess: (data, variables: { patientId: string; allergyId: string; data: any }) => {
      // I-invalidate ang cache para mag-refresh ang data
      queryClient.invalidateQueries({ queryKey: ['patient-allergies', variables.patientId] });
      // I-invalidate ang specific detail
      queryClient.invalidateQueries({ queryKey: ['patient-selected-allergy', variables.patientId, variables.allergyId] });
    },
    onError: (error) => {
      console.error("Failed to update allergy:", error);
    }
  });
};

export const useSoftDeleteAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, allergyId }: { patientId: string; allergyId: string; }) => 
      patientService.updateAllergy(patientId, allergyId, { is_deleted: true }),
    onSuccess: (data, variables) => {
      // I-invalidate ang listahan para mawala ang item na naka-is_deleted: true
      queryClient.invalidateQueries({ queryKey: ['patient-allergies', variables.patientId] });
    }
  });
};