import { supabase } from '../supabase';
import { Doctor, AccessRequest } from '../../types';

const MOCK_DOCTOR: Doctor = {
  id: 'd-67890',
  name: 'Dr. Gregory House',
};

export const DoctorService = {
  async login(doctorId: string): Promise<Doctor> {
    // In production:
    // const { data, error } = await supabase.from('doctors').select('*').eq('id', doctorId).single();
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_DOCTOR), 800));
  },

  async requestAccess(patientId: string, doctorId: string): Promise<AccessRequest> {
    // In production:
    // const { data } = await supabase.from('access_requests').insert({...}).select().single();
    return new Promise((resolve) => setTimeout(() => resolve({
      id: 'req-1',
      doctor_id: doctorId,
      patient_id: patientId,
      status: 'pending',
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      created_at: new Date().toISOString()
    }), 800));
  },
  
  async triggerEmergencyAccess(patientId: string, doctorId: string, reason: string): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 800));
  }
};
