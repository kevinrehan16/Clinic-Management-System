import apiClient from '../api/axiosInstance';

export interface Patient {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    email: string;
    is_active: boolean;
  };
  birth_date: string;
  gender: string;
  blood_type: string;
  // Idagdag ang iba pang fields kung kailangan
}

export const getPatients = async (): Promise<Patient[]> => {
  const response = await apiClient.get('patients/list/');
  return response.data; 
};

export const registerPatient = async (patientData: any) => {
  // Ang endpoint ay /users/register/patient/
  const response = await apiClient.post('/users/register/patient/', patientData);
  return response.data;
};