import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar: string;
  specialization?: string;
  language?: string[];
  availableSlots?: { day: string; slots: string[] }[];
  status?: 'active' | 'inactive';
  joinDate?: string;
  lastActive?: string;
}

export interface HealthIssue {
  id: string;
  name: string;
  category: 'NHM' | 'Ayush';
  description: string;
  icon: string;
  status: 'active' | 'inactive';
}

export interface ConsultationRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  issueId: string;
  issueName: string;
  issueCategory: 'NHM' | 'Ayush';
  symptoms: string[];
  date: string;
  timeSlot?: string;
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: {
    medicines: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    advice: string;
    followUp?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'allergy' | 'condition' | 'medication' | 'surgery' | 'document';
  name: string;
  details?: {
    dosage?: string;
    frequency?: string;
    year?: string;
    hospital?: string;
    date?: string;
    documentType?: string;
    fileUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminSettings {
  allowNewRegistrations: boolean;
  requirePrescriptionApproval: boolean;
  enableEmergencyConsultations: boolean;
  maxDailyConsultations: number;
  consultationTimeSlots: string[];
  workingDays: string[];
  consultationFees: {
    general: number;
    specialist: number;
    emergency: number;
  };
  paymentMethods: string[];
}

interface AppState {
  // Users
  users: User[];
  currentUser: User | null;
  
  // Health Issues
  healthIssues: HealthIssue[];
  
  // Consultations
  consultations: ConsultationRequest[];
  
  // Health Records
  healthRecords: HealthRecord[];

  // Admin Settings
  adminSettings: AdminSettings;
  
  // Actions
  login: (email: string, password: string, role: 'patient' | 'doctor' | 'admin') => Promise<boolean>;
  logout: () => void;
  
  // Admin Actions
  addDoctor: (doctor: Omit<User, 'id' | 'role'>) => void;
  updateDoctor: (id: string, updates: Partial<User>) => void;
  removeDoctor: (id: string) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  addHealthIssue: (issue: Omit<HealthIssue, 'id' | 'status'>) => void;
  updateHealthIssue: (id: string, updates: Partial<HealthIssue>) => void;
  toggleHealthIssueStatus: (id: string) => void;
  
  // Consultation Actions
  requestConsultation: (consultation: Omit<ConsultationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => string;
  scheduleConsultation: (consultationId: string, doctorId: string, timeSlot: string, date: string) => void;
  completeConsultation: (consultationId: string, prescription: ConsultationRequest['prescription'], notes: string) => void;
  
  // Health Record Actions
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Anand Sharma',
    email: 'patient@example.com',
    role: 'patient',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    language: ['English', 'Malayalam'],
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'doc1',
    name: 'Dr. Lakshmi Nair',
    email: 'doctor@example.com',
    role: 'doctor',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
    specialization: 'General Physician',
    language: ['English', 'Malayalam', 'Hindi'],
    availableSlots: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
    ],
    status: 'active',
    joinDate: '2024-01-01',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
    status: 'active',
    joinDate: '2024-01-01',
    lastActive: new Date().toISOString(),
  },
];

const mockHealthIssues: HealthIssue[] = [
  {
    id: 'issue1',
    name: 'Anxiety & Stress',
    category: 'NHM',
    description: 'Mental health concerns related to anxiety, stress, or depression',
    icon: 'mental_health',
    status: 'active',
  },
  {
    id: 'issue2',
    name: 'Chronic Headache',
    category: 'NHM',
    description: 'Recurring headaches including migraines and tension headaches',
    icon: 'headache',
    status: 'active',
  },
  {
    id: 'issue3',
    name: 'Digestive Issues',
    category: 'Ayush',
    description: 'Problems related to digestion, acidity, or gastric discomfort',
    icon: 'stomach',
    status: 'active',
  },
];

const defaultAdminSettings: AdminSettings = {
  allowNewRegistrations: true,
  requirePrescriptionApproval: true,
  enableEmergencyConsultations: true,
  maxDailyConsultations: 20,
  consultationTimeSlots: [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ],
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  consultationFees: {
    general: 50,
    specialist: 100,
    emergency: 150,
  },
  paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
};

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  users: mockUsers,
  currentUser: null,
  healthIssues: mockHealthIssues,
  consultations: [],
  healthRecords: [],
  adminSettings: defaultAdminSettings,

  // User Actions
  login: async (email, password, role) => {
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  // Admin Actions
  addDoctor: (doctor) => {
    const newDoctor: User = {
      ...doctor,
      id: uuidv4(),
      role: 'doctor',
      status: 'active',
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    set(state => ({
      users: [...state.users, newDoctor],
    }));
  },

  updateDoctor: (id, updates) => {
    set(state => ({
      users: state.users.map(u =>
        u.id === id && u.role === 'doctor'
          ? { ...u, ...updates, lastActive: new Date().toISOString() }
          : u
      ),
    }));
  },

  removeDoctor: (id) => {
    set(state => ({
      users: state.users.map(u =>
        u.id === id && u.role === 'doctor'
          ? { ...u, status: 'inactive', lastActive: new Date().toISOString() }
          : u
      ),
    }));
  },

  updateAdminSettings: (settings) => {
    set(state => ({
      adminSettings: { ...state.adminSettings, ...settings },
    }));
  },

  addHealthIssue: (issue) => {
    const newIssue: HealthIssue = {
      ...issue,
      id: uuidv4(),
      status: 'active',
    };

    set(state => ({
      healthIssues: [...state.healthIssues, newIssue],
    }));
  },

  updateHealthIssue: (id, updates) => {
    set(state => ({
      healthIssues: state.healthIssues.map(i =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
  },

  toggleHealthIssueStatus: (id) => {
    set(state => ({
      healthIssues: state.healthIssues.map(i =>
        i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
      ),
    }));
  },

  // Consultation Actions
  requestConsultation: (consultation) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newConsultation: ConsultationRequest = {
      ...consultation,
      id,
      status: 'requested',
      createdAt: now,
      updatedAt: now,
    };

    set(state => ({
      consultations: [...state.consultations, newConsultation],
    }));

    return id;
  },

  scheduleConsultation: (consultationId, doctorId, timeSlot, date) => {
    const doctor = get().users.find(u => u.id === doctorId);
    if (!doctor) return;

    set(state => ({
      consultations: state.consultations.map(c =>
        c.id === consultationId
          ? {
              ...c,
              doctorId,
              doctorName: doctor.name,
              timeSlot,
              date,
              status: 'scheduled',
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  completeConsultation: (consultationId, prescription, notes) => {
    set(state => ({
      consultations: state.consultations.map(c =>
        c.id === consultationId
          ? {
              ...c,
              prescription,
              notes,
              status: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }));
  },

  // Health Record Actions
  addHealthRecord: (record) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newRecord: HealthRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    };

    set(state => ({
      healthRecords: [...state.healthRecords, newRecord],
    }));
  },

  updateHealthRecord: (id, updates) => {
    set(state => ({
      healthRecords: state.healthRecords.map(r =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },

  deleteHealthRecord: (id) => {
    set(state => ({
      healthRecords: state.healthRecords.filter(r => r.id !== id),
    }));
  },
}));