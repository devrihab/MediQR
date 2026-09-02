import { supabase } from '../supabase';
import { Patient, AccessRequest } from '../../types';

// MVP: Mock Data for unverified authentication
const MOCK_PATIENT: Patient = {
  id: 'p-12345',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  blood_group: 'O+',
  allergies: [{ name: 'Penicillin', severity: 'severe' }],
  conditions: ['Asthma'],
  medications: ['Albuterol Inhaler'],
  emergency_contact: {
    name: 'Sarah Johnson',
    phone: '+1 555-0198',
    relation: 'Spouse',
  },
  last_updated: new Date().toISOString(),
  data_source: 'Self-reported',
};

export const PatientService = {
  async getPatientData(patientId: string): Promise<Patient> {
    // In production:
    // const { data, error } = await supabase.from('patients').select('*').eq('id', patientId).single();
    // if (error) throw error;
    // return data;
    
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENT), 600));
  },

  async login(name: string, email: string): Promise<Patient> {
    // In production, real auth would happen here
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENT), 800));
  },
  
  async getPendingAccessRequests(patientId: string): Promise<AccessRequest[]> {
    // In production:
    // const { data } = await supabase.from('access_requests').select('*').eq('patient_id', patientId).eq('status', 'pending');
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
  }
};
