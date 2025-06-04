import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminSettings {
  allowNewRegistrations: boolean;
  requirePrescriptionApproval: boolean;
  enableEmergencyConsultations: boolean;
  maxDailyConsultations: number;
  consultationTimeSlots: number[];
  workingDays: string[];
  consultationFees: {
    general: number;
    specialist: number;
    emergency: number;
  };
  paymentMethods: string[];
  prescriptionTemplates: string[];
}

interface AdminStats {
  totalDoctors: number;
  totalPatients: number;
  activeConsultations: number;
  completedConsultations: number;
  averageRating: number;
  revenueThisMonth: number;
  patientSatisfaction: number;
  averageWaitTime: number;
  emergencyCases: number;
  topHealthIssues: { name: string; count: number }[];
  doctorPerformance: {
    doctorId: string;
    name: string;
    consultations: number;
    rating: number;
    revenue: number;
  }[];
}

interface CaseSheet {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenLevel: string;
  };
  prescription: {
    medicines: {
      name: string;
      dosage: string;
      duration: string;
      timing: string;
    }[];
    advice: string;
    followUp?: string;
  };
  testResults: {
    id: string;
    name: string;
    date: string;
    type: string;
    url: string;
    notes: string;
  }[];
  notes: string;
  status: 'active' | 'archived';
}

interface AdminContextType {
  settings: AdminSettings;
  stats: AdminStats;
  caseSheets: CaseSheet[];
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  updateStats: (newStats: Partial<AdminStats>) => void;
  addCaseSheet: (caseSheet: Omit<CaseSheet, 'id'>) => void;
  updateCaseSheet: (id: string, updates: Partial<CaseSheet>) => void;
  getCaseSheet: (id: string) => CaseSheet | undefined;
  getPatientCaseSheets: (patientId: string) => CaseSheet[];
  getDoctorCaseSheets: (doctorId: string) => CaseSheet[];
}

const AdminContext = createContext<AdminContextType>({
  settings: {
    allowNewRegistrations: true,
    requirePrescriptionApproval: true,
    enableEmergencyConsultations: true,
    maxDailyConsultations: 20,
    consultationTimeSlots: [9, 10, 11, 14, 15, 16],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFees: {
      general: 50,
      specialist: 100,
      emergency: 150,
    },
    paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
    prescriptionTemplates: [
      'General Checkup',
      'Follow-up Visit',
      'Emergency Care',
      'Specialist Consultation',
    ],
  },
  stats: {
    totalDoctors: 0,
    totalPatients: 0,
    activeConsultations: 0,
    completedConsultations: 0,
    averageRating: 0,
    revenueThisMonth: 0,
    patientSatisfaction: 0,
    averageWaitTime: 0,
    emergencyCases: 0,
    topHealthIssues: [],
    doctorPerformance: [],
  },
  caseSheets: [],
  updateSettings: () => {},
  updateStats: () => {},
  addCaseSheet: () => {},
  updateCaseSheet: () => {},
  getCaseSheet: () => undefined,
  getPatientCaseSheets: () => [],
  getDoctorCaseSheets: () => [],
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AdminSettings>({
    allowNewRegistrations: true,
    requirePrescriptionApproval: true,
    enableEmergencyConsultations: true,
    maxDailyConsultations: 20,
    consultationTimeSlots: [9, 10, 11, 14, 15, 16],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFees: {
      general: 50,
      specialist: 100,
      emergency: 150,
    },
    paymentMethods: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
    prescriptionTemplates: [
      'General Checkup',
      'Follow-up Visit',
      'Emergency Care',
      'Specialist Consultation',
    ],
  });

  const [stats, setStats] = useState<AdminStats>({
    totalDoctors: 25,
    totalPatients: 150,
    activeConsultations: 8,
    completedConsultations: 450,
    averageRating: 4.5,
    revenueThisMonth: 15000,
    patientSatisfaction: 92,
    averageWaitTime: 12,
    emergencyCases: 15,
    topHealthIssues: [
      { name: 'Anxiety & Stress', count: 45 },
      { name: 'Chronic Headache', count: 32 },
      { name: 'Digestive Issues', count: 28 },
      { name: 'Joint Pain', count: 25 },
      { name: 'Sleep Disorders', count: 20 },
    ],
    doctorPerformance: [
      {
        doctorId: 'doc1',
        name: 'Dr. Lakshmi Nair',
        consultations: 120,
        rating: 4.8,
        revenue: 6000,
      },
      {
        doctorId: 'doc2',
        name: 'Dr. Rajesh Kumar',
        consultations: 95,
        rating: 4.6,
        revenue: 4750,
      },
    ],
  });

  const [caseSheets, setCaseSheets] = useState<CaseSheet[]>([]);

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateStats = (newStats: Partial<AdminStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const addCaseSheet = (caseSheet: Omit<CaseSheet, 'id'>) => {
    const newCaseSheet: CaseSheet = {
      ...caseSheet,
      id: `case_${Date.now()}`,
    };
    setCaseSheets(prev => [...prev, newCaseSheet]);
  };

  const updateCaseSheet = (id: string, updates: Partial<CaseSheet>) => {
    setCaseSheets(prev =>
      prev.map(cs => (cs.id === id ? { ...cs, ...updates } : cs))
    );
  };

  const getCaseSheet = (id: string) => {
    return caseSheets.find(cs => cs.id === id);
  };

  const getPatientCaseSheets = (patientId: string) => {
    return caseSheets.filter(cs => cs.patientId === patientId);
  };

  const getDoctorCaseSheets = (doctorId: string) => {
    return caseSheets.filter(cs => cs.doctorId === doctorId);
  };

  return (
    <AdminContext.Provider
      value={{
        settings,
        stats,
        caseSheets,
        updateSettings,
        updateStats,
        addCaseSheet,
        updateCaseSheet,
        getCaseSheet,
        getPatientCaseSheets,
        getDoctorCaseSheets,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);