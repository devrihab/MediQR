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
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENT), 600));
  },

  async login(identifier: string): Promise<{ patient: Patient, isNew: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isNew = identifier.toLowerCase().includes('new');
        if (isNew) {
          resolve({
            isNew: true,
            patient: {
              id: `p-${Math.floor(Math.random() * 10000)}`,
              name: identifier,
              email: '',
              blood_group: 'Unknown',
              allergies: [],
              conditions: [],
              medications: [],
              emergency_contact: { name: '', phone: '', relation: '' },
              last_updated: new Date().toISOString(),
              data_source: 'Self-reported',
            }
          });
        } else {
          resolve({
            isNew: false,
            patient: { ...MOCK_PATIENT, name: identifier }
          });
        }
      }, 800);
    });
  },
  
  async getPendingAccessRequests(patientId: string): Promise<AccessRequest[]> {
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
  }
};
