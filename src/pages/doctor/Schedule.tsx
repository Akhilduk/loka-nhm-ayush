import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Chip,
  Avatar,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  useTheme,
} from '@mui/material';
import { 
  Add, 
  VideoCall, 
  Close, 
  Edit, 
  DeleteOutline,
  AccessTime,
} from '@mui/icons-material';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation, ConsultationRequest } from '../../contexts/ConsultationContext';

const DoctorSchedule = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { consultations, assignDoctor } = useConsultation();
  const navigate = useNavigate();
  
  // State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Filter doctor's consultations
  const doctorConsultations = consultations.filter(c => c.doctorId === user?.id && c.status === 'scheduled');
  
  // Filter consultations for selected date
  const consultationsForSelectedDate = doctorConsultations.filter(c => c.date === selectedDate);
  
  // Get unassigned consultations
  const unassignedConsultations = consultations.filter(c => c.status === 'requested');
  
  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!user?.availableSlots) return [];
    
    // Get day of week for selected date
    const date = new Date(selectedDate);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Get available slots for that day
    const daySlots = user.availableSlots.find(slot => slot.day === dayOfWeek);
    if (!daySlots) return [];
    
    // Filter out already booked slots
    const bookedSlots = consultationsForSelectedDate.map(c => c.timeSlot);
    return daySlots.slots.filter(slot => !bookedSlots.includes(slot));
  };
  
  const availableTimeSlots = getAvailableTimeSlots();
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };
  
  const handleShowAssignDialog = (consultation: ConsultationRequest) => {
    setSelectedConsultation(consultation);
    setSelectedTimeSlot(availableTimeSlots.length > 0 ? availableTimeSlots[0] : '');
    setShowAssignDialog(true);
  };
  
  const handleCloseAssignDialog = () => {
    setShowAssignDialog(false);
    setSelectedConsultation(null);
    setSelectedTimeSlot('');
  };
  
  const handleAssignConsultation = () => {
    if (selectedConsultation && selectedTimeSlot && user) {
      assignDoctor(
        selectedConsultation.id, 
        user.id, 
        user.name, 
        selectedTimeSlot,
        selectedDate
      );
      handleCloseAssignDialog();
    }
  };
  
  // Helper to format time slot for display
  const formatTimeSlot = (timeSlot: string) => {
    return timeSlot;
  };
  
  // Generate next 7 days for date selection
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      options.push({ value: dateStr, label: displayDate });
    }
    
    return options;
  };
  
  const dateOptions = generateDateOptions();
  
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Schedule Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your consultation schedule and assign patients to available time slots.
      </Typography>

      <Grid container spacing={3}>
        {/* Date selection and schedule */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Consultation Schedule
                </Typography>
                
                <TextField
                  select
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  variant="outlined"
                  size="small"
                  sx={{ width: 200 }}
                >
                  {dateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              
              {consultationsForSelectedDate.length > 0 ? (
                <Grid container spacing={2}>
                  {consultationsForSelectedDate.map((consultation, index) => (
                    <Grid item xs={12} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          mb: 1,
                          transition: '0.3s',
                          '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          },
                        }}
                      >
                        <CardContent sx={{ py: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Avatar 
                                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt={consultation.patientName}
                              />
                            </Grid>
                            <Grid item xs>
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
                            </Grid>
                            <Grid item>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" fontWeight={500}>
                                  {formatTimeSlot(consultation.timeSlot || '')}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<VideoCall />}
                                  onClick={() => navigate(`/consultation/${consultation.id}`)}
                                >
                                  Join
                                </Button>
                                <IconButton size="small">
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Stack>
                            </Grid>
                          </Grid>
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
                    py: 5,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Calendar size={40} color={theme.palette.text.secondary} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    No consultations scheduled for this date
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Available Time Slots
                </Typography>
                
                {availableTimeSlots.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableTimeSlots.map((slot, index) => (
                      <Chip
                        key={index}
                        label={formatTimeSlot(slot)}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No available time slots for this date
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Unassigned consultations */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Pending Requests
                </Typography>
                
                {unassignedConsultations.length > 0 && (
                  <Chip 
                    label={`${unassignedConsultations.length} pending`} 
                    color="warning" 
                    size="small"
                  />
                )}
              </Box>
              
              {unassignedConsultations.length > 0 ? (
                <List disablePadding>
                  {unassignedConsultations.map((consultation, index) => (
                    <ListItem 
                      key={index}
                      disablePadding
                      sx={{ 
                        py: 1.5,
                        borderBottom: index < unassignedConsultations.length - 1 ? '1px solid' : 'none',
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
                        secondary={
                          <>
                            <Box component="span" sx={{ display: 'block' }}>
                              {consultation.issueName}
                            </Box>
                            <Chip 
                              label={consultation.issueCategory} 
                              color={consultation.issueCategory === 'NHM' ? 'primary' : 'secondary'} 
                              size="small"
                              sx={{ mt: 0.5, height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                            />
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => handleShowAssignDialog(consultation)}
                        disabled={availableTimeSlots.length === 0}
                      >
                        Assign
                      </Button>
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
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    No pending consultation requests
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Assign Consultation Dialog */}
      <Dialog 
        open={showAssignDialog} 
        onClose={handleCloseAssignDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Assign Consultation</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseAssignDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Patient Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Patient Name"
                  value={selectedConsultation?.patientName || ''}
                  fullWidth
                  disabled
                  size="small"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Health Issue"
                  value={selectedConsultation?.issueName || ''}
                  fullWidth
                  disabled
                  size="small"
                  margin="dense"
                />
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Symptoms: {selectedConsultation?.symptoms.join(', ')}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Schedule Appointment
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Time Slot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  fullWidth
                  disabled={availableTimeSlots.length === 0}
                  margin="dense"
                  helperText={availableTimeSlots.length === 0 ? "No available slots for this date" : ""}
                >
                  {availableTimeSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {formatTimeSlot(slot)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAssignConsultation}
            disabled={!selectedTimeSlot || availableTimeSlots.length === 0}
          >
            Assign Consultation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorSchedule;