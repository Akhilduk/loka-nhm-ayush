import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Pages
import UserDashboard from './pages/user/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import ConsultationRequest from './pages/user/ConsultationRequest';
import MyConsultations from './pages/user/MyConsultations';
import HealthProfile from './pages/user/HealthProfile';
import DoctorSchedule from './pages/doctor/Schedule';
import PatientList from './pages/doctor/PatientList';
import ConsultationRoom from './pages/common/ConsultationRoom';
import Welcome from './pages/Welcome';
import Layout from './components/layout/Layout';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ConsultationProvider } from './contexts/ConsultationContext';
import { AdminProvider } from './contexts/AdminContext';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset to top of page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <AuthProvider>
      <AdminProvider>
        <ConsultationProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route element={<Layout />}>
              {/* User routes */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/request-consultation" element={<ConsultationRequest />} />
              <Route path="/user/my-consultations" element={<MyConsultations />} />
              <Route path="/user/health-profile" element={<HealthProfile />} />
              
              {/* Doctor routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/doctor/patients" element={<PatientList />} />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              {/* Common routes */}
              <Route path="/consultation/:id" element={<ConsultationRoom />} />
            </Route>
          </Routes>
        </ConsultationProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;