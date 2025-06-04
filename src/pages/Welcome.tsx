import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Heart,
  Stethoscope,
  Brain,
  Activity,
  Shield,
  Users,
  Globe,
  Sparkles,
  ChevronRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TypeAnimation } from 'react-type-animation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Welcome = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { text: 'Loka Health Connect transformed my healthcare journey', author: 'Anita S., Dubai', role: 'Patient' },
    { text: 'Advanced telemedicine platform with exceptional care', author: 'Dr. Kumar M.', role: 'Physician' },
    { text: 'Seamless integration of traditional and modern medicine', author: 'Priya K., Toronto', role: 'Patient' },
  ];

  const healthStats = [
    { icon: <Users className="w-6 h-6" />, number: '50K+', label: 'Active Users' },
    { icon: <Stethoscope className="w-6 h-6" />, number: '1000+', label: 'Doctors' },
    { icon: <Globe className="w-6 h-6" />, number: '25+', label: 'Countries' },
    { icon: <Heart className="w-6 h-6" />, number: '99.9%', label: 'Satisfaction' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setLoginError(false);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setLoginError(false);

    try {
      const role = tabValue === 0 ? 'patient' : tabValue === 1 ? 'doctor' : 'admin';
      const success = await login(email, password, role);

      if (success) {
        if (role === 'patient') {
          navigate('/user/dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setLoginError(true);
      }
    } catch (error) {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    setLoginError(false);

    try {
      let demoEmail =
        role === 'patient' ? 'patient@example.com' : role === 'doctor' ? 'doctor@example.com' : 'admin@example.com';
      const success = await login(demoEmail, 'password', role);

      if (success) {
        if (role === 'patient') {
          navigate('/user/dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setLoginError(true);
      }
    } catch (error) {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <Box className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-blue-300"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-blue-200"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Stethoscope className="w-10 h-10" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-blue-400"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Brain className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-60 left-1/3 text-blue-300"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <Activity className="w-7 h-7" />
        </motion.div>
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-25"
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </Box>

      <Box className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Hero Section */}
        {!isMobile && (
          <Box className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              {/* Logo & Brand */}
              <Box className="flex items-center mb-8">
                <Box className="relative">
                  <Box className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </Box>
                  <Box className="absolute -top-1 -right-1 w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </Box>
                </Box>
                <Box className="ml-4">
                  <Typography variant="h6" className="text-2xl font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                    Loka Health Connect
                  </Typography>
                  <Typography variant="body2" className="text-blue-200">
                    Advanced Healthcare Platform
                  </Typography>
                </Box>
              </Box>

              {/* Main Headline */}
              <Box className="mb-8">
                <Typography variant="h2" className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Your Health,{' '}
                  <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">Reimagined</span>
                </Typography>
                <Typography variant="h6" className="text-xl text-blue-100 mb-6">
                  Connect with Kerala's finest healthcare professionals from anywhere in the world. Experience personalized care
                  that bridges traditional wisdom with modern medicine.
                </Typography>
              </Box>

              {/* Health Stats */}
              <Box className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {healthStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/20 hover:shadow-md hover:bg-white/15 transition-all duration-300"
                  >
                    <Box className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg mb-2 mx-auto text-white">
                      {stat.icon}
                    </Box>
                    <Box className="text-center">
                      <Typography variant="h6" className="text-2xl font-bold text-white">
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" className="text-sm text-blue-200">
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Testimonial Carousel */}
              <Box className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20">
                <Box className="flex items-center mb-4">
                  <Box className="w-2 h-2 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full mr-2" />
                  <Typography variant="body2" className="text-sm font-medium text-blue-100">
                    What our users say
                  </Typography>
                </Box>
                <Box className="overflow-hidden">
                  <motion.div
                    className="flex"
                    animate={{ x: `-${currentTestimonial * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <Box key={index} className="w-full flex-shrink-0">
                        <Typography variant="body2" className="text-blue-50 italic mb-3">
                          "{testimonial.text}"
                        </Typography>
                        <Box className="flex items-center">
                          <Box className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {testimonial.author.charAt(0)}
                          </Box>
                          <Box>
                            <Typography variant="body2" className="font-medium text-white">
                              {testimonial.author}
                            </Typography>
                            <Typography variant="body2" className="text-sm text-blue-200">
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}

        {/* Right Login Section */}
        <Box className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <Container maxWidth="sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isMobile && (
                <Box className="text-center mb-8">
                  <Box className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </Box>
                  <Typography variant="h4" className="mt-4 font-bold text-white">
                    Loka Health Connect
                  </Typography>
                  <Typography variant="body1" className="mt-2 text-blue-200">
                    Bringing healthcare closer to Non-Resident Keralites
                  </Typography>
                </Box>
              )}

              <Card
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
                elevation={8}
              >
                <CardContent sx={{ p: 6 }}>
                  <Box className="text-center mb-8">
                    <Avatar className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 mx-auto mb-4 shadow-lg">
                      <Shield className="w-10 h-10 text-white" />
                    </Avatar>
                    <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                      Welcome Back
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Access your personalized healthcare dashboard
                    </Typography>
                  </Box>

                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-1 mb-6 border border-blue-400/20"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        color: tabValue === 0 ? '#ffffff' : '#9ca3af',
                        '&.Mui-selected': {
                          backgroundColor: '#ffffff',
                          color: '#2563eb',
                          borderRadius: '0.75rem',
                        },
                      },
                    }}
                  >
                    <Tab
                      label={
                        <Box className="flex items-center gap-2">
                          <UserRound className="w-4 h-4" />
                          Patient
                        </Box>
                      }
                    />
                    <Tab
                      label={
                        <Box className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Doctor
                        </Box>
                      }
                    />
                    <Tab
                      label={
                        <Box className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          Admin
                        </Box>
                      }
                    />
                  </Tabs>

                  {loginError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      Invalid email or password. Please try again.
                    </Alert>
                  )}

                  <TabPanel value={tabValue} index={0}>
                    <form onSubmit={handleLogin}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                className="text-blue-300 hover:text-blue-100"
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {loading ? (
                          <Box className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Box className="flex items-center gap-2">
                            Sign In
                            <ChevronRight className="w-4 h-4" />
                          </Box>
                        )}
                      </Button>
                    </form>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 3 }}>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                      <Typography variant="body2" className="text-blue-600">
                        or try demo
                      </Typography>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      disabled={loading}
                      onClick={() => handleDemoLogin('patient')}
                      className="bg-white/10 border-blue-400/40 text-blue-100 py-3 rounded-xl hover:border-blue-300 hover:text-white hover:bg-white/20 transition-all duration-300"
                      startIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Try Demo as Patient
                    </Button>
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
                    <form onSubmit={handleLogin}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                className="text-blue-300 hover:text-blue-100"
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {loading ? (
                          <Box className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Box className="flex items-center gap-2">
                            Sign In
                            <ChevronRight className="w-4 h-4" />
                          </Box>
                        )}
                      </Button>
                    </form>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 3 }}>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                      <Typography variant="body2" className="text-blue-600">
                        or try demo
                      </Typography>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      disabled={loading}
                      onClick={() => handleDemoLogin('doctor')}
                      className="bg-white/10 border-blue-400/40 text-blue-100 py-3 rounded-xl hover:border-blue-300 hover:text-white hover:bg-white/20 transition-all duration-300"
                      startIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Try Demo as Doctor
                    </Button>
                  </TabPanel>

                  <TabPanel value={tabValue} index={2}>
                    <form onSubmit={handleLogin}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-blue-900/20 rounded-xl"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock className="h-5 w-5 text-blue-300" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                className="text-blue-300 hover:text-blue-100"
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          className: 'text-white placeholder-blue-200',
                          sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(147, 197, 253, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#60a5fa',
                            },
                          },
                        }}
                        InputLabelProps={{
                          className: 'text-blue-200',
                        }}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {loading ? (
                          <Box className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Box className="flex items-center gap-2">
                            Sign In
                            <ChevronRight className="w-4 h-4" />
                          </Box>
                        )}
                      </Button>
                    </form>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 3 }}>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                      <Typography variant="body2" className="text-blue-600">
                        or try demo
                      </Typography>
                      <Divider sx={{ flex: 1, borderColor: 'rgba(147, 197, 253, 0.3)' }} />
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      disabled={loading}
                      onClick={() => handleDemoLogin('admin')}
                      className="bg-white/10 border-blue-400/40 text-blue-100 py-3 rounded-xl hover:border-blue-300 hover:text-white hover:bg-white/20 transition-all duration-300"
                      startIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Try Demo as Admin
                    </Button>
                  </TabPanel>

                  <Box className="text-center mt-6">
                    <Typography variant="body2" className="text-blue-100">
                      New to Loka Health?{' '}
                      <button className="text-blue-200 hover:text-white font-medium">Create Account</button>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Box className="text-center mt-6">
                <Typography variant="body2" className="text-blue-200">
                  © 2025 Loka Health Connect. Secure & HIPAA Compliant
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* Floating Action Button */}
      <Box className="fixed bottom-6 right-6 z-20">
        <Button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center">
          <Heart className="w-6 h-6" />
        </Button>
      </Box>
    </Box>
  );
};

export default Welcome;