import apiClient from '../api/axiosInstance';

// Interface para sa Patient (Read)
export interface Patient {
  id: string;
  username: string; // Idagdag mo rin ito
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  address: string;
  phone_number: string | null;
  birth_date: string;
  gender: string;
  blood_type: string;
  land_line: string | null;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH'; // Base sa backend model mo
  created_at: string;
}

// Service Methods
export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const { data } = await apiClient.get('patients/list/'); // Siguraduhin ang absolute path
    return data;
  },

  getPatientById: async (id: string): Promise<Patient> => {
    const { data } = await apiClient.get(`patients/${id}/`);
    return data;
  },

  registerPatient: async (patientData: FormData | object): Promise<Patient> => {
    const { data } = await apiClient.post('users/register/patient/', patientData);
    return data;
  },

  updatePatient: async (id: string, data: any): Promise<Patient> => {
    const res = await apiClient.patch(`/patients/${id}/`, data);
    return res.data;
  },

  getPatientAllergies: async (patientId: string): Promise<Allergy[]> => {
    const { data } = await apiClient.get('patients/allergies/',{
      params: { patient_id: patientId }
    });
    return data;
  },
};