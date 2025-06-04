import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  VideoCall, 
  Message, 
  MoreVert, 
  Close,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultation } from '../../contexts/ConsultationContext';

const PatientList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { consultations } = useConsultation();
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Get unique patients
  const getUniquePatients = () => {
    const doctorConsultations = consultations.filter(c => c.doctorId === user?.id);
    const uniquePatients = new Map();
    
    doctorConsultations.forEach(consultation => {
      if (!uniquePatients.has(consultation.patientId)) {
        uniquePatients.set(consultation.patientId, {
          id: consultation.patientId,
          name: consultation.patientName,
          lastConsultation: consultation.date,
          consultationCount: 1,
          latestIssue: consultation.issueName,
          status: consultation.status,
        });
      } else {
        const patient = uniquePatients.get(consultation.patientId);
        patient.consultationCount += 1;
        
        // Update last consultation if this one is more recent
        if (new Date(consultation.date) > new Date(patient.lastConsultation)) {
          patient.lastConsultation = consultation.date;
          patient.latestIssue = consultation.issueName;
          patient.status = consultation.status;
        }
      }
    });
    
    return Array.from(uniquePatients.values());
  };
  
  const uniquePatients = getUniquePatients();
  
  // Filter patients based on search and tab
  const filteredPatients = uniquePatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (tabValue === 0) return matchesSearch;
    if (tabValue === 1) return matchesSearch && new Date(patient.lastConsultation) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return matchesSearch;
  });
  
  // Get patient consultations
  const getPatientConsultations = (patientId: string) => {
    return consultations.filter(c => c.patientId === patientId && c.doctorId === user?.id);
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenPatientDialog = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowPatientDialog(true);
  };
  
  const handleClosePatientDialog = () => {
    setShowPatientDialog(false);
    setSelectedPatientId(null);
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const selectedPatientConsultations = selectedPatientId
    ? getPatientConsultations(selectedPatientId)
    : [];
  
  const selectedPatient = selectedPatientId
    ? uniquePatients.find(p => p.id === selectedPatientId)
    : null;
  
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Patient Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage your patients and their consultation history.
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Patients" />
              <Tab label="Recent (30 days)" />
            </Tabs>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Search patients..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
              
              <IconButton>
                <FilterList />
              </IconButton>
            </Box>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Last Consultation</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell align="center">Total Sessions</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt={patient.name}
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body1" fontWeight={500}>
                            {patient.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(patient.lastConsultation)}</TableCell>
                      <TableCell>{patient.latestIssue}</TableCell>
                      <TableCell align="center">{patient.consultationCount}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={patient.status} 
                          color={
                            patient.status === 'completed' 
                              ? 'success' 
                              : patient.status === 'scheduled' 
                                ? 'primary' 
                                : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VideoCall />}
                          >
                            Call
                          </Button>
                          <IconButton size="small">
                            <Message fontSize="small" />
                          </IconButton>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleOpenPatientDialog(patient.id)}
                          >
                            View History
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No patients found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Showing {filteredPatients.length} of {uniquePatients.length} patients
            </Typography>
            
            <Button
              size="small"
              startIcon={<ArrowBack />}
              disabled
            >
              Previous
            </Button>
            
            <Button
              size="small"
              endIcon={<ArrowForward />}
              disabled
              sx={{ ml: 1 }}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Patient History Dialog */}
      <Dialog 
        open={showPatientDialog} 
        onClose={handleClosePatientDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt={selectedPatient?.name}
                sx={{ mr: 2, width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="h6">{selectedPatient?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Patient History
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClosePatientDialog} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Consultations
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {selectedPatientConsultations.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      First Visit
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedPatientConsultations.length > 0
                        ? formatDate(selectedPatientConsultations
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date)
                        : '-'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Visit
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedPatientConsultations.length > 0
                        ? formatDate(selectedPatientConsultations
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date)
                        : '-'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Consultation History
          </Typography>
          
          {selectedPatientConsultations.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Issue</TableCell>
                    <TableCell>Symptoms</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPatientConsultations
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((consultation) => (
                      <TableRow key={consultation.id} hover>
                        <TableCell>
                          {formatDate(consultation.date)}
                          {consultation.timeSlot && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {consultation.timeSlot}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {consultation.issueName}
                            </Typography>
                            <Chip 
                              label={consultation.issueCategory} 
                              color={consultation.issueCategory === 'NHM' ? 'primary' : 'secondary'} 
                              size="small"
                              sx={{ height: 20, mt: 0.5, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {consultation.symptoms.join(', ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={consultation.status} 
                            color={
                              consultation.status === 'completed' 
                                ? 'success' 
                                : consultation.status === 'scheduled' 
                                  ? 'primary' 
                                  : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {consultation.status === 'completed' ? (
                            <Button
                              size="small"
                              variant="outlined"
                            >
                              View Report
                            </Button>
                          ) : consultation.status === 'scheduled' ? (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<VideoCall />}
                            >
                              Join
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                            >
                              Assign
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No consultation history found for this patient
              </Typography>
            </Box>
          )}
          
          {consultation => consultation.status === 'completed' && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Medical Records
              </Typography>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                No medical records available
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePatientDialog}>Close</Button>
          <Button variant="contained" startIcon={<VideoCall />}>
            Start New Consultation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientList;