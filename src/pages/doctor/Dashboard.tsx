import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Badge,
  useTheme,
} from '@mui/material';
import { ChevronRight, VideoCall, Message, MoreVert } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  BarChart2, 
  Clock, 
  CheckCircle,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation } from '../../contexts/ConsultationContext';

// Components
import DoctorStats from '../../components/doctor/DoctorStats';

const DoctorDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { consultations } = useConsultation();
  const navigate = useNavigate();
  
  // Filter doctor's consultations
  const doctorConsultations = consultations.filter(c => c.doctorId === user?.id);
  const todayConsultations = doctorConsultations.filter(c => {
    const today = new Date().toISOString().split('T')[0];
    return c.date === today && c.status === 'scheduled';
  });
  
  const pendingConsultations = consultations.filter(c => c.status === 'requested');
  const recentPatients = [...new Set(doctorConsultations.map(c => c.patientId))].slice(0, 5);
  
  // Quick actions
  const quickActions = [
    { icon: <VideoCall />, label: 'Join Next Call', action: () => {
      if (todayConsultations.length > 0) {
        navigate(`/consultation/${todayConsultations[0].id}`);
      }
    }},
    { icon: <Calendar />, label: 'My Schedule', action: () => navigate('/doctor/schedule') },
    { icon: <Users />, label: 'Patients', action: () => navigate('/doctor/patients') },
    { icon: <BarChart2 />, label: 'Performance', action: () => {} },
  ];
  
  // Get next scheduled consultation
  const getNextConsultation = () => {
    if (todayConsultations.length === 0) return null;
    
    return todayConsultations.sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.timeSlot?.replace(' ', '')}`).getTime();
      const timeB = new Date(`${b.date}T${b.timeSlot?.replace(' ', '')}`).getTime();
      return timeA - timeB;
    })[0];
  };
  
  const nextConsultation = getNextConsultation();
  
  // Format time from 24-hour format
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    return timeStr;
  };
  
  // Check if consultation is happening now or within 15 minutes
  const isConsultationSoon = (consultation: typeof nextConsultation) => {
    if (!consultation || !consultation.timeSlot) return false;
    
    const now = new Date();
    const consultationTime = new Date(`${consultation.date}T${consultation.timeSlot.replace(' ', '')}`);
    const diffMinutes = (consultationTime.getTime() - now.getTime()) / (1000 * 60);
    
    return diffMinutes >= -15 && diffMinutes <= 30;
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, Dr. {user?.name.split(' ')[1]}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your schedule and patients for today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick actions */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      height: 120,
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          color: 'white',
                          mb: 1,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="body1" fontWeight={500} align="center">
                        {action.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        {/* Next consultation */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Next Consultation
                </Typography>
                {todayConsultations.length > 0 && (
                  <Chip 
                    label={`${todayConsultations.length} today`} 
                    color="primary" 
                    size="small"
                  />
                )}
              </Box>
              
              {nextConsultation ? (
                <Box>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: isConsultationSoon(nextConsultation) ? 'primary.light' : 'transparent',
                        color: isConsultationSoon(nextConsultation) ? 'white' : 'text.primary',
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              isConsultationSoon(nextConsultation) ? (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'success.main',
                                    border: '2px solid white',
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Avatar 
                              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                              alt={nextConsultation.patientName}
                              sx={{ width: 60, height: 60 }}
                            />
                          </Badge>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {nextConsultation.patientName}
                          </Typography>
                          <Typography variant="body2" color={isConsultationSoon(nextConsultation) ? 'white' : 'text.secondary'}>
                            {nextConsultation.issueName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Clock size={16} />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {formatTime(nextConsultation.timeSlot)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Button
                            variant={isConsultationSoon(nextConsultation) ? 'contained' : 'outlined'}
                            color={isConsultationSoon(nextConsultation) ? 'secondary' : 'primary'}
                            startIcon={<VideoCall />}
                            onClick={() => navigate(`/consultation/${nextConsultation.id}`)}
                            disabled={!isConsultationSoon(nextConsultation)}
                          >
                            {isConsultationSoon(nextConsultation) ? 'Join Now' : 'Upcoming'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Today's Schedule
                  </Typography>
                  
                  <List disablePadding>
                    {todayConsultations.slice(0, 3).map((consultation, index) => (
                      <ListItem 
                        key={index}
                        disablePadding
                        sx={{ 
                          py: 1,
                          borderBottom: index < todayConsultations.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {consultation.patientName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={consultation.patientName} 
                          secondary={consultation.issueName}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(consultation.timeSlot)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  
                  {todayConsultations.length > 3 && (
                    <Button 
                      endIcon={<ChevronRight />}
                      sx={{ mt: 1 }}
                      size="small"
                      onClick={() => navigate('/doctor/schedule')}
                    >
                      View all ({todayConsultations.length})
                    </Button>
                  )}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Calendar size={40} color={theme.palette.text.secondary} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    No consultations scheduled for today
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pending requests */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Pending Consultation Requests
                </Typography>
                {pendingConsultations.length > 0 && (
                  <Chip 
                    label={`${pendingConsultations.length} pending`} 
                    color="warning" 
                    size="small"
                  />
                )}
              </Box>
              
              {pendingConsultations.length > 0 ? (
                <Grid container spacing={2}>
                  {pendingConsultations.map((consultation, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                              <Avatar 
                                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt={consultation.patientName}
                              />
                              
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {consultation.patientName}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                  <Chip 
                                    label={consultation.issueCategory} 
                                    color={consultation.issueCategory === 'NHM' ? 'primary' : 'secondary'} 
                                    size="small"
                                    sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    {consultation.issueName}
                                  </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Symptoms: {consultation.symptoms.join(', ')}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Stack direction="row" spacing={1}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => navigate('/doctor/schedule')}
                              >
                                Accept
                              </Button>
                              <IconButton size="small">
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <CheckCircle size={40} color={theme.palette.success.main} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No pending consultation requests
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Doctor stats */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Performance Metrics
              </Typography>
              <DoctorStats />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent patients */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Patients
              </Typography>
              
              {recentPatients.length > 0 ? (
                <List disablePadding>
                  {doctorConsultations
                    .filter(c => recentPatients.includes(c.patientId))
                    .slice(0, 5)
                    .map((consultation, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          px: 0,
                          py: 1.5,
                          borderBottom: index < recentPatients.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt={consultation.patientName}
                          />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={consultation.patientName} 
                          secondary={consultation.issueName}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" color="primary">
                            <VideoCall fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <Message fontSize="small" />
                          </IconButton>
                        </Stack>
                      </ListItem>
                    ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4,
                  }}
                >
                  <Users size={40} color={theme.palette.text.secondary} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No patients yet
                  </Typography>
                </Box>
              )}
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => navigate('/doctor/patients')}
              >
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Health tip card */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              background: 'linear-gradient(90deg, rgba(44,107,237,1) 0%, rgba(68,143,255,1) 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Activity size={24} />
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
                      Doctor Wellness Tip
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Remember to take regular breaks between consultations. Brief 5-minute stretches and eye rest can significantly reduce fatigue and improve your focus throughout the day.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    sx={{ color: 'white' }}
                  >
                    View Wellness Resources
                  </Button>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box 
                    component="img"
                    src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Doctor wellness"
                    sx={{ 
                      width: '100%',
                      maxHeight: 160,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;