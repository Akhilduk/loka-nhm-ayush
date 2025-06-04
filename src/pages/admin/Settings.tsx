import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Button,
  Chip,
  IconButton,
  FormControlLabel,
  Divider,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add, Delete, Save, Edit } from '@mui/icons-material';
import { useAdmin } from '../../contexts/AdminContext';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newTemplate, setNewTemplate] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingFees, setEditingFees] = useState(false);
  const [tempFees, setTempFees] = useState(settings.consultationFees);

  const handleSettingChange = (setting: string, value: any) => {
    updateSettings({ [setting]: value });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot && !settings.consultationTimeSlots.includes(parseInt(newTimeSlot))) {
      updateSettings({
        consultationTimeSlots: [...settings.consultationTimeSlots, parseInt(newTimeSlot)].sort((a, b) => a - b),
      });
      setNewTimeSlot('');
    }
  };

  const handleRemoveTimeSlot = (slot: number) => {
    updateSettings({
      consultationTimeSlots: settings.consultationTimeSlots.filter((s) => s !== slot),
    });
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod && !settings.paymentMethods.includes(newPaymentMethod)) {
      updateSettings({
        paymentMethods: [...settings.paymentMethods, newPaymentMethod],
      });
      setNewPaymentMethod('');
    }
  };

  const handleRemovePaymentMethod = (method: string) => {
    updateSettings({
      paymentMethods: settings.paymentMethods.filter((m) => m !== method),
    });
  };

  const handleAddTemplate = () => {
    if (newTemplate && !settings.prescriptionTemplates.includes(newTemplate)) {
      updateSettings({
        prescriptionTemplates: [...settings.prescriptionTemplates, newTemplate],
      });
      setNewTemplate('');
      setShowTemplateDialog(false);
    }
  };

  const handleRemoveTemplate = (template: string) => {
    updateSettings({
      prescriptionTemplates: settings.prescriptionTemplates.filter((t) => t !== template),
    });
  };

  const handleSaveFees = () => {
    updateSettings({ consultationFees: tempFees });
    setEditingFees(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure and manage your healthcare platform settings.
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  General Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Allow New Registrations"
                      secondary="Enable or disable new user registrations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowNewRegistrations}
                        onChange={(e) => handleSettingChange('allowNewRegistrations', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Require Prescription Approval"
                      secondary="Require admin approval for prescriptions"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.requirePrescriptionApproval}
                        onChange={(e) => handleSettingChange('requirePrescriptionApproval', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Enable Emergency Consultations"
                      secondary="Allow emergency consultation requests"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.enableEmergencyConsultations}
                        onChange={(e) => handleSettingChange('enableEmergencyConsultations', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Maximum Daily Consultations"
                      secondary="Set maximum consultations per doctor per day"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        value={settings.maxDailyConsultations}
                        onChange={(e) => handleSettingChange('maxDailyConsultations', parseInt(e.target.value))}
                        sx={{ width: 80 }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Consultation Fees */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Consultation Fees
                  </Typography>
                  <IconButton onClick={() => setEditingFees(!editingFees)}>
                    {editingFees ? <Save onClick={handleSaveFees} /> : <Edit />}
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="General Consultation Fee"
                      type="number"
                      value={editingFees ? tempFees.general : settings.consultationFees.general}
                      onChange={(e) => setTempFees({ ...tempFees, general: parseInt(e.target.value) })}
                      disabled={!editingFees}
                      InputProps={{ startAdornment: <Typography>$</Typography> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Specialist Consultation Fee"
                      type="number"
                      value={editingFees ? tempFees.specialist : settings.consultationFees.specialist}
                      onChange={(e) => setTempFees({ ...tempFees, specialist: parseInt(e.target.value) })}
                      disabled={!editingFees}
                      InputProps={{ startAdornment: <Typography>$</Typography> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Consultation Fee"
                      type="number"
                      value={editingFees ? tempFees.emergency : settings.consultationFees.emergency}
                      onChange={(e) => setTempFees({ ...tempFees, emergency: parseInt(e.target.value) })}
                      disabled={!editingFees}
                      InputProps={{ startAdornment: <Typography>$</Typography> }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Time Slots */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Consultation Time Slots
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Add Time Slot (24h format)"
                    type="number"
                    size="small"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTimeSlot}
                    disabled={!newTimeSlot}
                    startIcon={<Add />}
                  >
                    Add Slot
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {settings.consultationTimeSlots.map((slot) => (
                    <Chip
                      key={slot}
                      label={`${slot}:00`}
                      onDelete={() => handleRemoveTimeSlot(slot)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Payment Methods */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Payment Methods
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Add Payment Method"
                    size="small"
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={handleAddPaymentMethod}
                    disabled={!newPaymentMethod}
                    startIcon={<Add />}
                  >
                    Add Method
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {settings.paymentMethods.map((method) => (
                    <Chip
                      key={method}
                      label={method}
                      onDelete={() => handleRemovePaymentMethod(method)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Prescription Templates */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Prescription Templates
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowTemplateDialog(true)}
                  >
                    Add Template
                  </Button>
                </Box>
                
                <Grid container spacing={2}>
                  {settings.prescriptionTemplates.map((template) => (
                    <Grid item xs={12} sm={6} md={4} key={template}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{template}</Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveTemplate(template)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add Template Dialog */}
      <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)}>
        <DialogTitle>Add Prescription Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTemplate} variant="contained" disabled={!newTemplate}>
            Add Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;