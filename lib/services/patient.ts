import { supabase } from '../supabase';
import { Patient, AccessRequest, QR, AuditLog } from '../../types';

// In-memory fallback for Hackathon MVP when Supabase isn't configured
const MEMORY_DB = {
  patients: new Map<string, Patient>(),
  qrs: new Map<string, QR>(),
  audit_logs: [] as AuditLog[],
};

const isConfigured = () => {
  return process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co';
};

export const PatientService = {
  async login(email: string, password: string): Promise<{ patient: Patient | null, isNew: boolean }> {
    // Deterministic fallback ID
    const id = `p-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      let user = null;
      // Try real Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          // Auto sign-up for hackathon MVP experience
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) throw signUpError;
          user = signUpData.user;
          if (!user) throw new Error("Signup failed");
        } else {
          throw signInError;
        }
      } else {
        user = signInData.user;
      }

      if (!user) throw new Error("Auth failed");

      // Use the real authenticated user's ID
      const patientId = user.id;
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error && error.code === 'PGRST116') {
        return { patient: { id: patientId, email, name: '' } as Patient, isNew: true };
      }
      
      if (error) throw error;
      return { patient: data, isNew: false };
    } catch (e: any) {
      // Fallback for unconfigured/network issues
      if (MEMORY_DB.patients.has(id)) {
        return { patient: MEMORY_DB.patients.get(id)!, isNew: false };
      }
      return { patient: { id, email, name: '' } as Patient, isNew: true };
    }
  },

  async createPatient(patient: Omit<Patient, 'last_updated' | 'data_source'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      data_source: 'self-reported',
      last_updated: new Date().toISOString(),
    };
    
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('patients')
        .insert(newPatient)
        .select()
        .single();
        
      if (error) throw error;
      await this.regenerateQR(patient.id);
      return data;
    } catch (e) {
      // Fallback
      MEMORY_DB.patients.set(newPatient.id, newPatient);
      await this.regenerateQR(newPatient.id);
      return newPatient;
    }
  },

  async updatePatient(patient: Patient): Promise<Patient> {
    const updatedPatient = {
      ...patient,
      last_updated: new Date().toISOString(),
    };

    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('patients')
        .update(updatedPatient)
        .eq('id', patient.id)
        .select()
        .single();

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        patient_id: patient.id,
        type: 'edit_data',
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (e) {
      // Fallback
      MEMORY_DB.patients.set(updatedPatient.id, updatedPatient);
      MEMORY_DB.audit_logs.unshift({
        id: `audit-${Date.now()}`,
        patient_id: updatedPatient.id,
        type: 'edit_data',
        timestamp: new Date().toISOString()
      });
      return updatedPatient;
    }
  },

  async getPatientData(patientId: string): Promise<Patient> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      if (MEMORY_DB.patients.has(patientId)) return MEMORY_DB.patients.get(patientId)!;
      throw new Error('Patient not found');
    }
  },

  async getActiveQR(patientId: string): Promise<QR | null> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('qrs')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .single();
        
      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (e) {
      const qrs = Array.from(MEMORY_DB.qrs.values());
      const active = qrs.find(q => q.patient_id === patientId && q.is_active);
      return active || null;
    }
  },

  async regenerateQR(patientId: string): Promise<QR> {
    const newQR: QR = {
      patient_id: patientId,
      code_value: `qr-${patientId}-${Date.now()}`,
      is_active: true
    };

    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      await supabase
        .from('qrs')
        .update({ is_active: false })
        .eq('patient_id', patientId)
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('qrs')
        .insert(newQR)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      // Invalidate old in memory
      for (const [k, v] of MEMORY_DB.qrs.entries()) {
        if (v.patient_id === patientId && v.is_active) {
          MEMORY_DB.qrs.set(k, { ...v, is_active: false });
        }
      }
      MEMORY_DB.qrs.set(newQR.code_value, newQR);
      return newQR;
    }
  },

  async getAccessHistory(patientId: string): Promise<AuditLog[]> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      return MEMORY_DB.audit_logs.filter(l => l.patient_id === patientId);
    }
  },

  async reportAccess(auditId: string): Promise<void> {
    try {
      if (!isConfigured()) throw new Error('Supabase not configured');
      
      const { error } = await supabase
        .from('audit_logs')
        .update({ is_reported: true })
        .eq('id', auditId);
        
      if (error) throw error;
    } catch (e) {
      const idx = MEMORY_DB.audit_logs.findIndex(l => l.id === auditId);
      if (idx !== -1) {
        MEMORY_DB.audit_logs[idx].is_reported = true;
      }
    }
  }
};
