import { create } from 'zustand';
import { Role, Patient, Doctor } from '../types';

interface AuthState {
  role: Role | null;
  patient: Patient | null;
  doctor: Doctor | null;
  setRole: (role: Role | null) => void;
  loginPatient: (patient: Patient) => void;
  loginDoctor: (doctor: Doctor) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  patient: null,
  doctor: null,
  setRole: (role) => set({ role }),
  loginPatient: (patient) => set({ patient, role: 'patient' }),
  loginDoctor: (doctor) => set({ doctor, role: 'doctor' }),
  logout: () => set({ role: null, patient: null, doctor: null }),
}));
