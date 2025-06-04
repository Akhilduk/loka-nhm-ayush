import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Avatar,
  useTheme,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation, HealthIssue } from '../../contexts/ConsultationContext';
import { TypeAnimation } from 'react-type-animation';

const steps = ['Health Issue', 'Symptoms', 'Preferences', 'Review'];

const ConsultationRequest = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { availableIssues, addConsultation } = useConsultation();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'NHM' | 'Ayush' | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'bot' | 'user' }[]>([
    { text: "Hello! I'm your virtual health assistant. Let's talk about what's bothering you today.", sender: 'bot' }
  ]);
  const [waiting, setWaiting] = useState(false);

  // Filter issues by category
  const filteredIssues = selectedCategory
    ? availableIssues.filter(issue => issue.category === selectedCategory)
    : availableIssues;

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return !!selectedIssue;
      case 1:
        return symptoms.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      simulateBotResponse(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleCategorySelect = (category: 'NHM' | 'Ayush') => {
    setSelectedCategory(category);
    setSelectedIssue(null);
    
    // Add bot response
    addChatMessage({
      text: `Great, you've selected ${category} services. What specific health issue are you experiencing?`,
      sender: 'bot'
    });
  };

  const handleIssueSelect = (issue: HealthIssue) => {
    setSelectedIssue(issue);
    
    // Add user message
    addChatMessage({
      text: `I'm experiencing issues with ${issue.name}`,
      sender: 'user'
    });
    
    // Simulate bot response
    simulateTyping(() => {
      addChatMessage({
        text: `I understand you're experiencing ${issue.name}. Can you tell me more about your symptoms? Please describe what you're feeling.`,
        sender: 'bot'
      });
    });
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      const newSymptom = symptomInput.trim();
      setSymptoms([...symptoms, newSymptom]);
      setSymptomInput('');
      
      // Add user message
      addChatMessage({
        text: newSymptom,
        sender: 'user'
      });
      
      // Simulate bot response if it's the first symptom
      if (symptoms.length === 0) {
        simulateTyping(() => {
          addChatMessage({
            text: "Thank you for sharing that. Are there any other symptoms you're experiencing? You can add multiple symptoms to help us better understand your condition.",
            sender: 'bot'
          });
        });
      }
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = () => {
    if (!user || !selectedIssue) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const consultationId = addConsultation({
        patientId: user.id,
        patientName: user.name,
        issueId: selectedIssue.id,
        issueName: selectedIssue.name,
        issueCategory: selectedIssue.category,
        symptoms,
        date: new Date().toISOString().split('T')[0],
        status: 'requested',
        notes: additionalNotes,
      });
      
      setIsSubmitting(false);
      navigate('/user/my-consultations', { state: { newConsultation: consultationId } });
    }, 1500);
  };

  const addChatMessage = (message: { text: string; sender: 'bot' | 'user' }) => {
    setChatMessages(prev => [...prev, message]);
  };

  const simulateTyping = (callback: () => void) => {
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
      callback();
    }, 1500);
  };

  const simulateBotResponse = (step: number) => {
    let message = '';
    
    switch (step) {
      case 1:
        if (selectedIssue) {
          message = `I understand you're experiencing ${selectedIssue.name}. Can you tell me more about your symptoms? Please describe what you're feeling.`;
        }
        break;
      case 2:
        message = "Thank you for sharing your symptoms. Do you have any language preferences for your consultation?";
        break;
      case 3:
        message = "Great! I've gathered all the information needed. Please review your consultation request and submit when you're ready.";
        break;
      default:
        return;
    }
    
    if (message) {
      simulateTyping(() => {
        addChatMessage({
          text: message,
          sender: 'bot'
        });
      });
    }
  };

  // Add initial messages based on step when component mounts
  useEffect(() => {
    if (chatMessages.length === 1) {
      simulateTyping(() => {
        addChatMessage({
          text: "To get started, please select whether you need NHM (general health) or Ayush (traditional medicine) services.",
          sender: 'bot'
        });
      });
    }
  }, []);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Health Service Type
            </Typography>
            
            {!selectedCategory && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                      height: '100%',
                    }}
                    onClick={() => handleCategorySelect('NHM')}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                      <Avatar
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          bgcolor: 'primary.main',
                          mb: 2,
                        }}
                      >
                        NHM
                      </Avatar>
                      <Typography variant="h6" align="center" gutterBottom>
                        National Health Mission
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        General health services including psychological consultations
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                      height: '100%',
                    }}
                    onClick={() => handleCategorySelect('Ayush')}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                      <Avatar
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          bgcolor: 'secondary.main',
                          mb: 2,
                        }}
                      >
                        AY
                      </Avatar>
                      <Typography variant="h6" align="center" gutterBottom>
                        Ayush Services
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Traditional Ayurvedic treatments and consultations
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            {selectedCategory && (
              <>
                <Typography variant="body1" gutterBottom>
                  Please select the health issue you're experiencing:
                </Typography>
                
                <Grid container spacing={2}>
                  {filteredIssues.map((issue) => (
                    <Grid item xs={12} sm={6} md={4} key={issue.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedIssue?.id === issue.id ? `2px solid ${issue.category === 'NHM' ? theme.palette.primary.main : theme.palette.secondary.main}` : 'none',
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          },
                        }}
                        onClick={() => handleIssueSelect(issue)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label={issue.category} 
                              color={issue.category === 'NHM' ? 'primary' : 'secondary'} 
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {issue.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {issue.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Describe Your Symptoms
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Enter symptom"
                variant="outlined"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                sx={{ mb: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddSymptom}
                disabled={!symptomInput.trim()}
              >
                Add Symptom
              </Button>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Added Symptoms:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {symptoms.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No symptoms added yet
                </Typography>
              ) : (
                symptoms.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    onDelete={() => handleRemoveSymptom(symptom)}
                    color="primary"
                    variant="outlined"
                  />
                ))
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Please be specific about your symptoms to help our doctors provide the best care.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Consultation Preferences
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Preferred Language:
            </Typography>
            <RadioGroup
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              sx={{ mb: 3 }}
            >
              <FormControlLabel value="English" control={<Radio />} label="English" />
              <FormControlLabel value="Malayalam" control={<Radio />} label="Malayalam" />
              <FormControlLabel value="Hindi" control={<Radio />} label="Hindi" />
            </RadioGroup>
            
            <Typography variant="subtitle2" gutterBottom>
              Additional Notes:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Any additional information you'd like to share with the doctor..."
              variant="outlined"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" color="text.secondary">
              Your preferences help us match you with the most suitable healthcare provider.
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Consultation Request
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Health Service:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedIssue?.category}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      Health Issue:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedIssue?.name}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      Preferred Language:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {preferredLanguage}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Symptoms:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {symptoms.map((symptom, index) => (
                        <Chip key={index} label={symptom} size="small" />
                      ))}
                    </Box>
                    
                    {additionalNotes && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">
                          Additional Notes:
                        </Typography>
                        <Typography variant="body2">
                          {additionalNotes}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Typography variant="body2" color="text.secondary">
              By submitting this request, our team will review your information and match you with an appropriate healthcare provider. You'll receive a notification once your consultation is scheduled.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Request a Consultation
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Tell us about your health concerns, and we'll connect you with the right healthcare provider.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label} completed={isStepComplete(index) && index < activeStep}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent(activeStep)}
                </motion.div>
              </AnimatePresence>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={activeStep === steps.length - 1 ? <Check /> : <ArrowForward />}
                  disabled={!isStepComplete(activeStep) || isSubmitting}
                >
                  {activeStep === steps.length - 1 ? (
                    isSubmitting ? 'Submitting...' : 'Submit Request'
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Chat with Health Assistant
              </Typography>
              
              <Box 
                sx={{ 
                  flex: 1, 
                  bgcolor: 'background.default', 
                  borderRadius: 2, 
                  p: 2, 
                  mb: 2,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: 400,
                }}
              >
                {chatMessages.map((message, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      alignSelf: message.sender === 'bot' ? 'flex-start' : 'flex-end',
                      maxWidth: '80%',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: message.sender === 'bot' ? 'grey.100' : 'primary.main',
                        color: message.sender === 'bot' ? 'text.primary' : 'white',
                        borderRadius: message.sender === 'bot' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                        p: 2,
                      }}
                    >
                      {index === chatMessages.length - 1 && message.sender === 'bot' ? (
                        <TypeAnimation
                          sequence={[message.text]}
                          speed={70}
                          cursor={false}
                        />
                      ) : (
                        <Typography variant="body2">{message.text}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                
                {waiting && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Typing...
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                disabled={waiting}
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && activeStep === 1) {
                    handleAddSymptom();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={waiting || !symptomInput.trim() || activeStep !== 1}
                      onClick={handleAddSymptom}
                    >
                      Send
                    </Button>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsultationRequest;