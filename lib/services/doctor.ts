import { supabase } from '../supabase';
import { Doctor, AccessRequest } from '../../types';

const isConfigured = () => {
  return process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co';
};

const MEMORY_DB = {
  doctors: new Map<string, Doctor>(),
  access_requests: [] as AccessRequest[],
};

export const DoctorService = {
  async login(doctorId: string): Promise<Doctor> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();
        
      if (error && error.code === 'PGRST116') {
        // Mock creation for MVP if they don't exist
        const newDoctor = { id: doctorId, name: `Dr. ${doctorId}` };
        await supabase.from('doctors').insert(newDoctor);
        return newDoctor;
      }
      if (error) throw error;
      return data;
    } catch (e) {
      if (MEMORY_DB.doctors.has(doctorId)) return MEMORY_DB.doctors.get(doctorId)!;
      const newDoctor = { id: doctorId, name: `Dr. ${doctorId}` };
      MEMORY_DB.doctors.set(doctorId, newDoctor);
      return newDoctor;
    }
  },

  async requestAccess(patientId: string, doctorId: string): Promise<AccessRequest> {
    const newRequest: Omit<AccessRequest, 'id'> = {
      doctor_id: doctorId,
      patient_id: patientId,
      status: 'pending',
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      created_at: new Date().toISOString()
    };

    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('access_requests')
        .insert(newRequest)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (e) {
      const fallbackReq = { ...newRequest, id: `req-${Date.now()}` };
      MEMORY_DB.access_requests.push(fallbackReq);
      return fallbackReq;
    }
  },
  
  async triggerEmergencyAccess(patientId: string, doctorId: string, reason: string): Promise<boolean> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { error } = await supabase.from('audit_logs').insert({
        patient_id: patientId,
        doctor_id: doctorId,
        type: 'emergency_view',
        reason,
        timestamp: new Date().toISOString()
      });
      
      if (error) throw error;
      return true;
    } catch (e) {
      // Memory fallback is handled by patient service memory db for logs generally, 
      // but doctor service just needs to return true for MVP mock
      return true;
    }
  }
};
