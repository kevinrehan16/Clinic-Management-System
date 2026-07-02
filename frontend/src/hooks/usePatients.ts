import { useQuery } from '@tanstack/react-query';
import { getPatients, type Patient } from '../services/patientService';

export const usePatients = () => {
  return useQuery<Patient[], Error>({
    queryKey: ['patients'], // Ito ang cache key mo
    queryFn: getPatients,
    staleTime: 1000 * 60 * 5, // Optional: 5 minutes bago mag-isip na luma na ang data
  });
};