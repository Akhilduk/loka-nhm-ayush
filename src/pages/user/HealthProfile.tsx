import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Edit, Save, Delete, Add, CloudUpload, Visibility, ExpandMore } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Surgery {
  procedure: string;
  year: string;
  hospital: string;
}

interface Document {
  id: string;
  name: string;
  date: string;
  type: 'Lab Report' | 'Specialist Report' | 'Prescription' | 'Other';
  file: File | null;
  url?: string;
}

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' },
      overflow: 'hidden',
    }}
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const HealthProfile = () => {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [managingDocuments, setManagingDocuments] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Anand Sharma',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    bloodType: 'B+',
    height: '175',
    weight: '70',
    address: '123 Main St, Dubai, UAE',
    phone: '+971 55 123 4567',
    email: 'anand.sharma@example.com',
    emergencyContact: 'Priya Sharma (+971 55 987 6543)',
  });

  // Medical History State
  const [allergies, setAllergies] = useState(['Penicillin', 'Peanuts']);
  const [newAllergy, setNewAllergy] = useState('');
  const [conditions, setConditions] = useState(['Hypertension']);
  const [newCondition, setNewCondition] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  ]);
  const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '' });
  const [surgeries, setSurgeries] = useState<Surgery[]>([
    { procedure: 'Appendectomy', year: '2010', hospital: 'Mayo Clinic' },
  ]);
  const [newSurgery, setNewSurgery] = useState<Surgery>({ procedure: '', year: '', hospital: '' });

  // Documents State
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc1', name: 'Recent Blood Test', date: '2025-02-15', type: 'Lab Report', file: null },
    { id: 'doc2', name: 'Cardiac Evaluation', date: '2024-11-10', type: 'Specialist Report', file: null },
  ]);
  const [newDocument, setNewDocument] = useState<Document>({
    id: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Lab Report',
    file: null,
  });

  const generateId = useCallback(() => crypto.randomUUID(), []);

  const handleSaveProfile = useCallback(() => {
    setEditing(false);
    console.log('Saving profile data:', { personalInfo, allergies, conditions, medications, surgeries });

    let total = 0;
    if (personalInfo.fullName) total += 10;
    if (personalInfo.dateOfBirth) total += 10;
    if (personalInfo.gender) total += 5;
    if (personalInfo.bloodType) total += 5;
    if (personalInfo.height && personalInfo.weight) total += 10;
    if (personalInfo.address) total += 5;
    if (personalInfo.phone) total += 5;
    if (personalInfo.emergencyContact) total += 10;
    if (allergies.length > 0) total += 10;
    if (conditions.length > 0) total += 10;
    if (medications.length > 0) total += 10;
    if (surgeries.length > 0) total += 10;

    setProfileCompletion(total);
    setSnackbar({ open: true, message: 'Profile saved successfully!', severity: 'success' });
  }, [personalInfo, allergies, conditions, medications, surgeries]);

  const handlePersonalInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleAddAllergy = useCallback(() => {
    if (newAllergy.trim()) {
      setAllergies((prev) => [...prev, newAllergy.trim()]);
      setNewAllergy('');
      setSnackbar({ open: true, message: 'Allergy added!', severity: 'success' });
    }
  }, [newAllergy]);

  const handleRemoveAllergy = useCallback((index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
    setSnackbar({ open: true, message: 'Allergy removed!', severity: 'success' });
  }, []);

  const handleAddCondition = useCallback(() => {
    if (newCondition.trim()) {
      setConditions((prev) => [...prev, newCondition.trim()]);
      setNewCondition('');
      setSnackbar({ open: true, message: 'Condition added!', severity: 'success' });
    }
  }, [newCondition]);

  const handleRemoveCondition = useCallback((index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
    setSnackbar({ open: true, message: 'Condition removed!', severity: 'success' });
  }, []);

  const handleAddMedication = useCallback(() => {
    if (newMedication.name.trim() && newMedication.dosage.trim()) {
      setMedications((prev) => [...prev, newMedication]);
      setNewMedication({ name: '', dosage: '', frequency: '' });
      setSnackbar({ open: true, message: 'Medication added!', severity: 'success' });
    }
  }, [newMedication]);

  const handleRemoveMedication = useCallback((index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
    setSnackbar({ open: true, message: 'Medication removed!', severity: 'success' });
  }, []);

  const handleAddSurgery = useCallback(() => {
    if (newSurgery.procedure.trim() && newSurgery.year.trim()) {
      setSurgeries((prev) => [...prev, newSurgery]);
      setNewSurgery({ procedure: '', year: '', hospital: '' });
      setSnackbar({ open: true, message: 'Surgery added!', severity: 'success' });
    }
  }, [newSurgery]);

  const handleRemoveSurgery = useCallback((index: number) => {
    setSurgeries((prev) => prev.filter((_, i) => i !== index));
    setSnackbar({ open: true, message: 'Surgery removed!', severity: 'success' });
  }, []);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setSnackbar({ open: true, message: 'Invalid file type. Please upload PDF, PNG, or JPEG.', severity: 'error' });
        return;
      }

      if (file.size > maxSize) {
        setSnackbar({ open: true, message: 'File size exceeds 5MB.', severity: 'error' });
        return;
      }

      const url = URL.createObjectURL(file);
      if (editingDoc) {
        setEditingDoc((prev) => prev && { ...prev, file, url });
      } else {
        setNewDocument((prev) => ({ ...prev, file, url }));
      }
    }
  }, [editingDoc]);

  const handleAddDocument = useCallback(() => {
    if (!newDocument.name.trim() || !newDocument.file) {
      setSnackbar({ open: true, message: 'Please provide a document name and file.', severity: 'error' });
      return;
    }

    const newDoc: Document = { ...newDocument, id: generateId(), url: newDocument.url };
    setDocuments((prev) => [...prev, newDoc]);
    setNewDocument({ id: '', name: '', date: new Date().toISOString().split('T')[0], type: 'Lab Report', file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSnackbar({ open: true, message: 'Document added successfully!', severity: 'success' });
  }, [newDocument, generateId]);

  const handleEditDocument = useCallback((doc: Document) => {
    setEditingDoc(doc);
    setManagingDocuments(true);
  }, []);

  const handleUpdateDocument = useCallback(() => {
    if (!editingDoc || !editingDoc.name.trim() || !editingDoc.file) {
      setSnackbar({ open: true, message: 'Please provide a document name and file.', severity: 'error' });
      return;
    }

    setDocuments((prev) => prev.map((doc) => (doc.id === editingDoc.id ? editingDoc : doc)));
    setEditingDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSnackbar({ open: true, message: 'Document updated successfully!', severity: 'success' });
  }, [editingDoc]);

  const handleRemoveDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setSnackbar({ open: true, message: 'Document removed!', severity: 'success' });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleViewDocument = useCallback((doc: Document) => {
    setPreviewDoc(doc);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewDoc(null);
  }, []);

  const handleCloseDocumentManager = useCallback(() => {
    setManagingDocuments(false);
    setEditingDoc(null);
    setNewDocument({ id: '', name: '', date: new Date().toISOString().split('T')[0], type: 'Lab Report', file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const documentCards = useMemo(
    () =>
      documents.map((doc) => (
        <Grid item xs={12} sm={6} md={4} key={doc.id}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', width: 32, height: 32, fontSize: 14 }}>
                  {doc.type.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {doc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(doc.date).toLocaleDateString()} • {doc.type}
                  </Typography>
                </Box>
                <Tooltip title="View Document">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDocument(doc)}
                      disabled={!doc.url}
                      color="primary"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Edit Document">
                  <IconButton size="small" onClick={() => handleEditDocument(doc)} color="primary">
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Document">
                  <IconButton size="small" onClick={() => handleRemoveDocument(doc.id)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )),
    [documents, handleViewDocument, handleEditDocument, handleRemoveDocument]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Health Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Manage your health information and medical documents seamlessly.
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={!!previewDoc}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>{previewDoc?.name}</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {previewDoc?.url && (
            <iframe
              src={previewDoc.url}
              title={previewDoc.name}
              style={{ width: '100%', height: '60vh', border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={managingDocuments}
        onClose={handleCloseDocumentManager}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          {editingDoc ? 'Edit Document' : 'Add Document'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              sx={{
                flex: 1,
                border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.grey[400]}`,
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                bgcolor: isDragging ? theme.palette.primary.light : theme.palette.grey[100],
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { borderColor: theme.palette.primary.main, boxShadow: `0 0 8px ${theme.palette.primary.light}` },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              aria-label="Upload medical document"
            >
              <CloudUpload sx={{ fontSize: 32, color: theme.palette.grey[600] }} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Drag & drop or click to upload
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (PDF, PNG, JPEG, max 5MB)
              </Typography>
              <input
                type="file"
                accept=".pdf,.png,.jpeg,.jpg"
                hidden
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </Box>
            <Stack flex={1} spacing={2}>
              <TextField
                fullWidth
                label="Document Name"
                size="small"
                value={editingDoc ? editingDoc.name : newDocument.name}
                onChange={(e) =>
                  editingDoc
                    ? setEditingDoc({ ...editingDoc, name: e.target.value })
                    : setNewDocument({ ...newDocument, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                size="small"
                value={editingDoc ? editingDoc.date : newDocument.date}
                onChange={(e) =>
                  editingDoc
                    ? setEditingDoc({ ...editingDoc, date: e.target.value })
                    : setNewDocument({ ...newDocument, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={editingDoc ? editingDoc.type : newDocument.type}
                  label="Type"
                  onChange={(e) =>
                    editingDoc
                      ? setEditingDoc({ ...editingDoc, type: e.target.value as Document['type'] })
                      : setNewDocument({ ...newDocument, type: e.target.value as Document['type'] })
                  }
                >
                  <MenuItem value="Lab Report">Lab Report</MenuItem>
                  <MenuItem value="Specialist Report">Specialist Report</MenuItem>
                  <MenuItem value="Prescription">Prescription</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentManager} variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            onClick={editingDoc ? handleUpdateDocument : handleAddDocument}
            disabled={editingDoc ? !editingDoc.name.trim() || !editingDoc.file : !newDocument.name.trim() || !newDocument.file}
          >
            {editingDoc ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: { md: 'sticky' },
              top: { md: 16 },
              zIndex: 1,
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
              }}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Avatar
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Anand Sharma"
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: `2px solid ${theme.palette.primary.main}` }}
                />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {personalInfo.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {personalInfo.email}
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Profile Completion
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={profileCompletion}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'grey.300',
                      '& .MuiLinearProgress-bar': { bgcolor: theme.palette.success.main },
                    }}
                  />
                  <Typography variant="caption" fontWeight="bold" mt={0.5}>
                    {profileCompletion}% Complete
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={editing ? <Save /> : <Edit />}
                    onClick={editing ? handleSaveProfile : () => setEditing(true)}
                    fullWidth
                    sx={{ borderRadius: 1 }}
                  >
                    {editing ? 'Save Profile' : 'Edit Profile'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUpload />}
                    onClick={() => setManagingDocuments(true)}
                    fullWidth
                    sx={{ borderRadius: 1 }}
                  >
                    Manage Documents
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Stack spacing={2}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Personal Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <InfoCard title="">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={personalInfo.dateOfBirth}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset" disabled={!editing}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup row name="gender" value={personalInfo.gender} onChange={handlePersonalInfoChange}>
                          <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                          <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                          <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Blood Type"
                        name="bloodType"
                        value={personalInfo.bloodType}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Height (cm)"
                        name="height"
                        type="number"
                        value={personalInfo.height}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        value={personalInfo.weight}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        name="emergencyContact"
                        value={personalInfo.emergencyContact}
                        onChange={handlePersonalInfoChange}
                        disabled={!editing}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                  </Grid>
                </InfoCard>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Medical History
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <InfoCard title="">
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                        Allergies
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {allergies.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No allergies recorded
                          </Typography>
                        ) : (
                          allergies.map((allergy, index) => (
                            <Chip
                              key={index}
                              label={allergy}
                              onDelete={editing ? () => handleRemoveAllergy(index) : undefined}
                              color="error"
                              size="small"
                            />
                          ))
                        )}
                      </Box>
                      {editing && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Add Allergy"
                            size="small"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={handleAddAllergy}
                            disabled={!newAllergy.trim()}
                          >
                            Add
                          </Button>
                        </Stack>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                        Medical Conditions
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {conditions.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No medical conditions recorded
                          </Typography>
                        ) : (
                          conditions.map((condition, index) => (
                            <Chip
                              key={index}
                              label={condition}
                              onDelete={editing ? () => handleRemoveCondition(index) : undefined}
                              color="primary"
                              size="small"
                            />
                          ))
                        )}
                      </Box>
                      {editing && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Add Condition"
                            size="small"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={handleAddCondition}
                            disabled={!newCondition.trim()}
                          >
                            Add
                          </Button>
                        </Stack>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                        Current Medications
                      </Typography>
                      {medications.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No medications recorded
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {medications.map((med, index) => (
                            <Card key={index} variant="outlined" sx={{ borderRadius: 1 }}>
                              <CardContent sx={{ p: 1, '&:last-child': { p: 1 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {med.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {med.dosage} • {med.frequency}
                                    </Typography>
                                  </Box>
                                  {editing && (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRemoveMedication(index)}
                                      color="error"
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}
                      {editing && (
                        <Grid container spacing={1} alignItems="center" mt={1}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Medication Name"
                              size="small"
                              value={newMedication.name}
                              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Dosage"
                              size="small"
                              value={newMedication.dosage}
                              onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Frequency"
                              size="small"
                              value={newMedication.frequency}
                              onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={handleAddMedication}
                              disabled={!newMedication.name.trim() || !newMedication.dosage.trim()}
                              fullWidth
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                        Surgical History
                      </Typography>
                      {surgeries.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No surgical history recorded
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {surgeries.map((surgery, index) => (
                            <Card key={index} variant="outlined" sx={{ borderRadius: 1 }}>
                              <CardContent sx={{ p: 1, '&:last-child': { p: 1 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {surgery.procedure}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {surgery.year} • {surgery.hospital}
                                    </Typography>
                                  </Box>
                                  {editing && (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRemoveSurgery(index)}
                                      color="error"
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}
                      {editing && (
                        <Grid container spacing={1} alignItems="center" mt={1}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Procedure"
                              size="small"
                              value={newSurgery.procedure}
                              onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Year"
                              size="small"
                              value={newSurgery.year}
                              onChange={(e) => setNewSurgery({ ...newSurgery, year: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Hospital"
                              size="small"
                              value={newSurgery.hospital}
                              onChange={(e) => setNewSurgery({ ...newSurgery, hospital: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={handleAddSurgery}
                              disabled={!newSurgery.procedure.trim() || !newSurgery.year.trim()}
                              fullWidth
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </Stack>
                </InfoCard>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Medical Documents
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <InfoCard title="">
                  {documents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {documentCards}
                    </Grid>
                  )}
                </InfoCard>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthProfile;