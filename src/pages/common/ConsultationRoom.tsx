import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField, 
  IconButton, 
  Avatar, 
  Stack, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
} from '@mui/material';
import { 
  Mic, 
  MicOff, 
  Videocam, 
  VideocamOff, 
  ScreenShare, 
  StopScreenShare, 
  Chat, 
  ChatBubbleOutline,
  Close,
  Send,
  Add,
} from '@mui/icons-material';
import { Clock, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation } from '../../contexts/ConsultationContext';
import { useVideo } from '../../contexts/VideoContext';
import { useChat } from '../../contexts/ChatContext';

const ConsultationRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getConsultation, completeConsultation } = useConsultation();
  const { initSession, endSession, toggleVideo, toggleAudio, isVideoEnabled, isAudioEnabled } = useVideo();
  const { messages, sendMessage, isConnected } = useChat();
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState(getConsultation(id || ''));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Prescription state
  const [prescription, setPrescription] = useState({
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    advice: '',
    followUp: ''
  });

  useEffect(() => {
    if (id) {
      const consultationData = getConsultation(id);
      if (consultationData) {
        setConsultation(consultationData);
        // Initialize video session
        initSession('demo-session', 'demo-token');
      } else {
        navigate(-1);
      }
    }

    return () => {
      endSession();
    };
  }, [id, getConsultation, navigate, initSession, endSession]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const handleToggleScreenShare = () => {
    setScreenShareEnabled(!screenShareEnabled);
  };
  
  const handleEndCall = () => {
    setEndDialogOpen(true);
  };
  
  const confirmEndCall = () => {
    if (user?.role === 'doctor') {
      setPrescriptionDialogOpen(true);
    } else {
      endSession();
      navigate(-1);
    }
  };
  
  const handleAddMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        { name: '', dosage: '', duration: '', instructions: '' }
      ]
    });
  };
  
  const handleRemoveMedicine = (index: number) => {
    setPrescription({
      ...prescription,
      medicines: prescription.medicines.filter((_, i) => i !== index)
    });
  };
  
  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value
    };
    
    setPrescription({
      ...prescription,
      medicines: updatedMedicines
    });
  };
  
  const handleSavePrescription = () => {
    if (id && user?.role === 'doctor') {
      completeConsultation(id, prescription, noteValue);
      setPrescriptionDialogOpen(false);
      endSession();
      navigate('/doctor/dashboard');
    }
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!consultation) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5">Consultation not found</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 110px)' }}>
      <Grid container spacing={0} sx={{ height: '100%' }}>
        <Grid 
          item 
          xs={12} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.default',
            position: 'relative',
          }}
        >
          {/* Top bar */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={user?.role === 'doctor' 
                  ? "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  : "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                sx={{ width: 40, height: 40, mr: 1.5 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.role === 'doctor' ? consultation.patientName : consultation.doctorName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    label={consultation.issueCategory} 
                    color={consultation.issueCategory === 'NHM' ? 'primary' : 'secondary'} 
                    size="small"
                    sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Clock size={14} style={{ marginRight: 4 }} />
                    {formatTime(elapsedTime)}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            
            <Box>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleEndCall}
                sx={{ borderRadius: 4 }}
              >
                End Call
              </Button>
            </Box>
          </Box>
          
          {/* Main video area */}
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              position: 'relative',
              bgcolor: '#111',
              overflow: 'hidden',
            }}
          >
            {/* Publisher */}
            <div id="publisher" style={{ width: '100%', height: '100%' }} />
            
            {/* Subscriber */}
            <div id="subscriber" style={{ width: '100%', height: '100%' }} />
            
            {/* Doctor's notes area */}
            {user?.role === 'doctor' && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 300,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Consultation Notes
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Add notes about this consultation..."
                  fullWidth
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  sx={{ mb: 1 }}
                  size="small"
                />
                <Button variant="outlined" size="small" startIcon={<FileText size={16} />}>
                  Save Notes
                </Button>
              </Box>
            )}
          </Box>
          
          {/* Controls */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: 2,
            }}
          >
            <IconButton 
              sx={{ 
                bgcolor: isAudioEnabled ? 'primary.main' : 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: isAudioEnabled ? 'primary.dark' : 'error.dark',
                },
                width: 50,
                height: 50,
              }}
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
            
            <IconButton 
              sx={{ 
                bgcolor: isVideoEnabled ? 'primary.main' : 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: isVideoEnabled ? 'primary.dark' : 'error.dark',
                },
                width: 50,
                height: 50,
              }}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
            
            <IconButton 
              sx={{ 
                bgcolor: screenShareEnabled ? 'primary.main' : 'grey.700',
                color: 'white',
                '&:hover': {
                  bgcolor: screenShareEnabled ? 'primary.dark' : 'grey.800',
                },
                width: 50,
                height: 50,
              }}
              onClick={handleToggleScreenShare}
            >
              {screenShareEnabled ? <StopScreenShare /> : <ScreenShare />}
            </IconButton>
            
            <IconButton 
              sx={{ 
                bgcolor: chatOpen ? 'primary.main' : 'grey.700',
                color: 'white',
                '&:hover': {
                  bgcolor: chatOpen ? 'primary.dark' : 'grey.800',
                },
                width: 50,
                height: 50,
              }}
              onClick={() => setChatOpen(!chatOpen)}
            >
              {chatOpen ? <Chat /> : <ChatBubbleOutline />}
            </IconButton>
          </Box>
        </Grid>
        
        {/* Chat sidebar */}
        {chatOpen && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 320,
              bgcolor: 'background.paper',
              borderLeft: '1px solid',
              borderColor: 'divider',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Chat
              </Typography>
              <IconButton onClick={() => setChatOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                  No messages yet. Start the conversation!
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {messages.map((msg, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        alignSelf: msg.sender === user?.name ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: msg.sender === user?.name ? 'primary.main' : 'grey.100',
                          color: msg.sender === user?.name ? 'white' : 'text.primary',
                          borderRadius: msg.sender === user?.name ? '12px 0 12px 12px' : '0 12px 12px 12px',
                          p: 1.5,
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
            
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSendMessage} disabled={!newMessage.trim() || !isConnected}>
                      <Send />
                    </IconButton>
                  ),
                }}
              />
              {!isConnected && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  Reconnecting to chat...
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Grid>
      
      {/* End Call Dialog */}
      <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)}>
        <DialogTitle>End Consultation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to end this consultation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmEndCall}>
            End Consultation
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Prescription Dialog */}
      <Dialog 
        open={prescriptionDialogOpen} 
        onClose={() => setPrescriptionDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h6">Complete Consultation</Typography>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Prescription" />
            <Tab label="Patient Info" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Prescribed Medications
                  </Typography>
                  
                  {prescription.medicines.map((medicine, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Medicine Name"
                            value={medicine.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Dosage"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Duration"
                            value={medicine.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveMedicine(index)}
                              disabled={prescription.medicines.length === 1}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Instructions"
                            value={medicine.instructions}
                            onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  
                  <Button 
                    variant="outlined" 
                    onClick={handleAddMedicine}
                    startIcon={<Add />}
                    sx={{ mb: 3 }}
                  >
                    Add Medicine
                  </Button>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Doctor's Advice
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter any general advice for the patient..."
                    value={prescription.advice}
                    onChange={(e) => setPrescription({ ...prescription, advice: e.target.value })}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Follow-up Date (if needed)
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={prescription.followUp}
                    onChange={(e) => setPrescription({ ...prescription, followUp: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Patient Information
                      </Typography>
                      <List disablePadding>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {consultation.patientName.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={consultation.patientName} 
                            secondary="Patient" 
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                      </List>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Health Issue:</strong> {consultation.issueName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Category:</strong> {consultation.issueCategory}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Reported Symptoms
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {consultation.symptoms.map((symptom, index) => (
                          <Chip key={index} label={symptom} size="small" />
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Consultation Notes
                      </Typography>
                      <Typography variant="body2" color={noteValue ? 'text.primary' : 'text.secondary'}>
                        {noteValue || 'No notes recorded for this consultation.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePrescription}>
            Complete & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultationRoom;