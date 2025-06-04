import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface HealthIssue {
  id: string;
  name: string;
  category: 'NHM' | 'Ayush';
  description: string;
  icon: string;
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

interface ConsultationContextType {
  availableIssues: HealthIssue[];
  consultations: ConsultationRequest[];
  addConsultation: (consultation: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateConsultation: (id: string, updates: Partial<ConsultationRequest>) => void;
  getConsultation: (id: string) => ConsultationRequest | undefined;
  getPatientConsultations: (patientId: string) => ConsultationRequest[];
  getDoctorConsultations: (doctorId: string) => ConsultationRequest[];
  assignDoctor: (consultationId: string, doctorId: string, doctorName: string, timeSlot: string, date: string) => void;
  completeConsultation: (consultationId: string, prescription: ConsultationRequest['prescription'], notes: string) => void;
}

const ConsultationContext = createContext<ConsultationContextType>({
  availableIssues: [],
  consultations: [],
  addConsultation: () => '',
  updateConsultation: () => {},
  getConsultation: () => undefined,
  getPatientConsultations: () => [],
  getDoctorConsultations: () => [],
  assignDoctor: () => {},
  completeConsultation: () => {},
});

// Mock health issues
const mockHealthIssues: HealthIssue[] = [
  {
    id: 'issue1',
    name: 'Anxiety & Stress',
    category: 'NHM',
    description: 'Mental health concerns related to anxiety, stress, or depression',
    icon: 'mental_health',
  },
  {
    id: 'issue2',
    name: 'Chronic Headache',
    category: 'NHM',
    description: 'Recurring headaches including migraines and tension headaches',
    icon: 'headache',
  },
  {
    id: 'issue3',
    name: 'Digestive Issues',
    category: 'Ayush',
    description: 'Problems related to digestion, acidity, or gastric discomfort',
    icon: 'stomach',
  },
  {
    id: 'issue4',
    name: 'Joint Pain',
    category: 'Ayush',
    description: 'Arthritis, joint inflammation, or chronic pain in joints',
    icon: 'joint',
  },
  {
    id: 'issue5',
    name: 'Sleep Disorders',
    category: 'NHM',
    description: 'Insomnia, sleep apnea, or irregular sleep patterns',
    icon: 'sleep',
  },
  {
    id: 'issue6',
    name: 'Skin Conditions',
    category: 'Ayush',
    description: 'Eczema, psoriasis, acne, or other skin-related concerns',
    icon: 'skin',
  },
];

// Mock consultations
const mockConsultations: ConsultationRequest[] = [
  {
    id: 'consult1',
    patientId: 'user1',
    patientName: 'Anand Sharma',
    doctorId: 'doc1',
    doctorName: 'Dr. Lakshmi Nair',
    issueId: 'issue1',
    issueName: 'Anxiety & Stress',
    issueCategory: 'NHM',
    symptoms: ['Difficulty sleeping', 'Restlessness', 'Constant worry'],
    date: '2025-04-15',
    timeSlot: '10:00 AM',
    status: 'scheduled',
    notes: 'Patient has been experiencing increased work-related stress for 3 months',
    createdAt: '2025-04-10T08:30:00Z',
    updatedAt: '2025-04-10T14:15:00Z',
  },
  {
    id: 'consult2',
    patientId: 'user1',
    patientName: 'Anand Sharma',
    doctorId: 'doc2',
    doctorName: 'Dr. Rajesh Kumar',
    issueId: 'issue3',
    issueName: 'Digestive Issues',
    issueCategory: 'Ayush',
    symptoms: ['Stomach pain', 'Acidity', 'Bloating after meals'],
    date: '2025-04-05',
    timeSlot: '11:00 AM',
    status: 'completed',
    notes: 'Patient has been experiencing these symptoms for about 2 weeks',
    prescription: {
      medicines: [
        {
          name: 'Avipattikar Churna',
          dosage: '1 teaspoon',
          duration: '14 days',
          instructions: 'Take after meals with warm water',
        },
        {
          name: 'Triphala',
          dosage: '2 tablets',
          duration: '30 days',
          instructions: 'Take at night before sleep',
        },
      ],
      advice: 'Avoid spicy and oily foods. Include more fiber in your diet. Drink warm water throughout the day.',
      followUp: '2025-04-25',
    },
    createdAt: '2025-04-01T10:15:00Z',
    updatedAt: '2025-04-05T12:30:00Z',
  },
];

export const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [availableIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>(mockConsultations);

  // Load from localStorage on mount
  useEffect(() => {
    const storedConsultations = localStorage.getItem('telemedConsultations');
    if (storedConsultations) {
      setConsultations(JSON.parse(storedConsultations));
    }
  }, []);

  // Update localStorage when consultations change
  useEffect(() => {
    localStorage.setItem('telemedConsultations', JSON.stringify(consultations));
  }, [consultations]);

  const addConsultation = (consultation: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `consult${Date.now()}`;
    const now = new Date().toISOString();
    const newConsultation: ConsultationRequest = {
      ...consultation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    setConsultations(prev => [...prev, newConsultation]);
    return id;
  };

  const updateConsultation = (id: string, updates: Partial<ConsultationRequest>) => {
    setConsultations(prev => 
      prev.map(consultation => 
        consultation.id === id 
          ? { 
              ...consultation, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : consultation
      )
    );
  };

  const getConsultation = (id: string) => {
    return consultations.find(consultation => consultation.id === id);
  };

  const getPatientConsultations = (patientId: string) => {
    return consultations.filter(consultation => consultation.patientId === patientId);
  };

  const getDoctorConsultations = (doctorId: string) => {
    return consultations.filter(consultation => consultation.doctorId === doctorId);
  };

  const assignDoctor = (consultationId: string, doctorId: string, doctorName: string, timeSlot: string, date: string) => {
    updateConsultation(consultationId, {
      doctorId,
      doctorName,
      timeSlot,
      date,
      status: 'scheduled',
    });
  };

  const completeConsultation = (consultationId: string, prescription: ConsultationRequest['prescription'], notes: string) => {
    updateConsultation(consultationId, {
      prescription,
      notes,
      status: 'completed',
    });
  };

  return (
    <ConsultationContext.Provider
      value={{
        availableIssues,
        consultations,
        addConsultation,
        updateConsultation,
        getConsultation,
        getPatientConsultations,
        getDoctorConsultations,
        assignDoctor,
        completeConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => useContext(ConsultationContext);