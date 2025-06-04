import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar: string;
  specialization?: string;
  language?: string[];
  availableSlots?: { day: string; slots: string[] }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor' | 'admin') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Mock data for demo
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Anand Sharma',
    email: 'patient@example.com',
    role: 'patient',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    language: ['English', 'Malayalam'],
  },
  {
    id: 'doc1',
    name: 'Dr. Lakshmi Nair',
    email: 'doctor@example.com',
    role: 'doctor',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialization: 'General Physician',
    language: ['English', 'Malayalam', 'Hindi'],
    availableSlots: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'] },
    ],
  },
  {
    id: 'doc2',
    name: 'Dr. Rajesh Kumar',
    email: 'ayush@example.com',
    role: 'doctor',
    avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    specialization: 'Ayurveda',
    language: ['English', 'Malayalam', 'Hindi'],
    availableSlots: [
      { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
      { day: 'Saturday', slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
    ],
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('telemedUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor' | 'admin'): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo login logic - find user by email and role
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('telemedUser', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telemedUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);