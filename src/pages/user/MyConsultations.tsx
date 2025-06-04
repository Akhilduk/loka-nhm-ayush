import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Button,
  Chip,
  Divider,
  Alert,
  useTheme,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
} from '@mui/material';
import { VideoCall, Description, Feedback as FeedbackIcon, Close } from '@mui/icons-material';
import { Calendar, Clock, Pill } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation, ConsultationRequest } from '../../contexts/ConsultationContext';

const MyConsultations = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { consultations } = useConsultation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tabValue, setTabValue] = useState(0);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(4);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Filter user's consultations
  const userConsultations = user ? consultations.filter(c => c.patientId === user.id) : [];
  
  const upcomingConsultations = userConsultations.filter(c => c.status === 'scheduled');
  const requestedConsultations = userConsultations.filter(c => c.status === 'requested');
  const completedConsultations = userConsultations.filter(c => c.status === 'completed');
  
  const allConsultations = [
    ...requestedConsultations,
    ...upcomingConsultations,
    ...completedConsultations,
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Check if there's a new consultation notification
  useEffect(() => {
    if (location.state?.newConsultation) {
      setShowNewAlert(true);
      setTabValue(0); // Switch to all tab
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowNewAlert(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleJoinConsultation = (consultationId: string) => {
    navigate(`/consultation/${consultationId}`);
  };

  const handleOpenFeedback = (consultation: ConsultationRequest) => {
    setSelectedConsultation(consultation);
    setFeedbackOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
    setSelectedConsultation(null);
    setFeedbackRating(4);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = () => {
    // Here you would normally submit the feedback to your backend
    console.log('Submitting feedback:', { 
      consultationId: selectedConsultation?.id, 
      rating: feedbackRating, 
      comment: feedbackComment 
    });
    
    handleCloseFeedback();
  };

  const getStatusChip = (status: ConsultationRequest['status']) => {
    switch (status) {
      case 'requested':
        return <Chip label="Requested" color="info" size="small" />;
      case 'scheduled':
        return <Chip label="Scheduled" color="primary" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderConsultationsList = (consultationsList: ConsultationRequest[]) => {
    if (consultationsList.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Calendar size={40} color={theme.palette.text.secondary} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No consultations found
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {consultationsList.map((consultation) => (
          <Grid item xs={12} key={consultation.id}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: consultation.issueCategory === 'NHM' ? 'primary.main' : 'secondary.main' 
                      }}
                    >
                      {consultation.issueCategory === 'NHM' ? 'NH' : 'AY'}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {consultation.issueName}
                        </Typography>
                        {getStatusChip(consultation.status)}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Calendar size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          {formatDate(consultation.date)}
                        </Typography>
                        
                        {consultation.timeSlot && (
                          <>
                            <Clock size={16} sx={{ ml: 2 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                              {consultation.timeSlot}
                            </Typography>
                          </>
                        )}
                      </Box>
                      
                      {consultation.doctorName && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Doctor: <strong>{consultation.doctorName}</strong>
                        </Typography>
                      )}
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Symptoms:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {consultation.symptoms.map((symptom, index) => (
                            <Chip key={index} label={symptom} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'row', sm: 'column' }, 
                    gap: 1,
                    justifyContent: { xs: 'flex-start', sm: 'center' },
                    alignItems: { xs: 'center', sm: 'flex-end' },
                    mt: { xs: 1, sm: 0 },
                  }}>
                    {consultation.status === 'scheduled' && (
                      <Button
                        variant="contained"
                        startIcon={<VideoCall />}
                        onClick={() => handleJoinConsultation(consultation.id)}
                        size="small"
                      >
                        Join
                      </Button>
                    )}
                    
                    {consultation.status === 'completed' && (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<Description />}
                          size="small"
                        >
                          Prescription
                        </Button>
                        
                        <Button
                          variant="outlined"
                          startIcon={<FeedbackIcon />}
                          onClick={() => handleOpenFeedback(consultation)}
                          size="small"
                          color="secondary"
                        >
                          Feedback
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Consultations
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage all your consultation requests and appointments.
      </Typography>

      {showNewAlert && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowNewAlert(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Your consultation request has been submitted successfully! Our team will review it and assign a doctor soon.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab label={`All (${allConsultations.length})`} />
            <Tab label={`Requested (${requestedConsultations.length})`} />
            <Tab label={`Upcoming (${upcomingConsultations.length})`} />
            <Tab label={`Completed (${completedConsultations.length})`} />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {tabValue === 0 && renderConsultationsList(allConsultations)}
          {tabValue === 1 && renderConsultationsList(requestedConsultations)}
          {tabValue === 2 && renderConsultationsList(upcomingConsultations)}
          {tabValue === 3 && renderConsultationsList(completedConsultations)}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onClose={handleCloseFeedback} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Share Your Feedback</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseFeedback}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Pill size={20} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {selectedConsultation?.issueName} with {selectedConsultation?.doctorName}
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            How would you rate your consultation experience?
          </Typography>
          <Rating
            name="feedback-rating"
            value={feedbackRating}
            onChange={(_, newValue) => {
              setFeedbackRating(newValue);
            }}
            size="large"
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Additional comments (optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Cancel</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained"
            color="primary"
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyConsultations;