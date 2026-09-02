import { supabase } from '../supabase';
import { Patient, AccessRequest, QR, AuditLog } from '../../types';

export const PatientService = {
  async login(identifier: string): Promise<{ patient: Patient | null, isNew: boolean }> {
    // Deterministic ID for hackathon MVP
    const id = `p-${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    
    // Check if exists
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found -> isNew
      return { patient: { id, name: identifier } as Patient, isNew: true };
    }
    
    if (error) throw error;
    return { patient: data, isNew: false };
  },

  async createPatient(patient: Omit<Patient, 'last_updated' | 'data_source'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      data_source: 'self-reported',
      last_updated: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('patients')
      .insert(newPatient)
      .select()
      .single();
      
    if (error) throw error;
    
    // Generate initial QR
    await this.regenerateQR(patient.id);
    
    return data;
  },

  async updatePatient(patient: Patient): Promise<Patient> {
    const updatedPatient = {
      ...patient,
      last_updated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('patients')
      .update(updatedPatient)
      .eq('id', patient.id)
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await supabase.from('audit_logs').insert({
      patient_id: patient.id,
      type: 'edit_data',
      timestamp: new Date().toISOString()
    });

    return data;
  },

  async getPatientData(patientId: string): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (error) throw error;
    return data;
  },

  async getActiveQR(patientId: string): Promise<QR | null> {
    const { data, error } = await supabase
      .from('qrs')
      .select('*')
      .eq('patient_id', patientId)
      .eq('is_active', true)
      .single();
      
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  async regenerateQR(patientId: string): Promise<QR> {
    // Invalidate old
    await supabase
      .from('qrs')
      .update({ is_active: false })
      .eq('patient_id', patientId)
      .eq('is_active', true);

    // Create new
    const newQR = {
      patient_id: patientId,
      code_value: `qr-${patientId}-${Date.now()}`,
      is_active: true
    };

    const { data, error } = await supabase
      .from('qrs')
      .insert(newQR)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAccessHistory(patientId: string): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async reportAccess(auditId: string): Promise<void> {
    const { error } = await supabase
      .from('audit_logs')
      .update({ is_reported: true })
      .eq('id', auditId);
      
    if (error) throw error;
  }
};
