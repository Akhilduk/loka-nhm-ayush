import { Box, Typography, Avatar, Chip, Button, Stack } from '@mui/material';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ConsultationRequest } from '../../contexts/ConsultationContext';

interface UpcomingConsultationProps {
  consultation: ConsultationRequest;
}

const UpcomingConsultation = ({ consultation }: UpcomingConsultationProps) => {
  const navigate = useNavigate();
  
  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate time until consultation
  const getTimeUntil = () => {
    const now = new Date();
    const consultationDate = new Date(`${consultation.date}T${consultation.timeSlot?.replace(' ', '')}`);
    const diffTime = consultationDate.getTime() - now.getTime();
    
    if (diffTime < 0) return 'Now';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} away`;
    }
  };

  const isConsultationWithin30Min = () => {
    const now = new Date();
    const consultationDate = new Date(`${consultation.date}T${consultation.timeSlot?.replace(' ', '')}`);
    const diffTime = consultationDate.getTime() - now.getTime();
    return diffTime <= 30 * 60 * 1000 && diffTime > 0;
  };

  const handleJoinConsultation = () => {
    navigate(`/consultation/${consultation.id}`);
  };

  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Avatar 
          src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt={consultation.doctorName}
          sx={{ width: 56, height: 56 }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(consultation.date)} • {consultation.timeSlot}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 0.5 }}>
            {consultation.doctorName}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Chip 
              label={consultation.issueCategory} 
              color={consultation.issueCategory === 'NHM' ? 'primary' : 'secondary'} 
              size="small"
              sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
            />
            <Chip 
              label={consultation.issueName} 
              variant="outlined" 
              size="small"
              sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
            />
          </Stack>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Chip 
            label={getTimeUntil()} 
            color={isConsultationWithin30Min() ? 'error' : 'info'} 
            size="small"
            sx={{ mb: 1, fontSize: '0.75rem' }}
          />
          
          <Button
            variant="contained"
            size="small"
            startIcon={<VideoCallIcon />}
            onClick={handleJoinConsultation}
            disabled={!isConsultationWithin30Min()}
          >
            {isConsultationWithin30Min() ? 'Join Now' : 'Upcoming'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UpcomingConsultation;