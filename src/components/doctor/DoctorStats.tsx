import { useState } from 'react';
import { Box, Typography, Button, ButtonGroup, Grid, useTheme } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const mockConsultationData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekly: [4, 6, 5, 8, 4, 3, 0],
  monthly: [5, 7, 6, 4, 3, 5, 4, 6, 5, 3, 4, 5, 6, 7, 5, 4, 3, 5, 4, 3, 5, 6, 4, 3, 4, 5, 3, 4],
  yearly: [15, 22, 28, 25, 30, 18, 24, 32, 30, 28, 35, 15],
};

const mockIssueTypeData = {
  labels: ['Anxiety & Stress', 'Chronic Headache', 'Digestive Issues', 'Joint Pain', 'Sleep Disorders', 'Skin Conditions'],
  data: [25, 15, 20, 18, 12, 10],
};

const mockFeedbackData = {
  labels: ['Excellent', 'Good', 'Average', 'Poor'],
  data: [65, 25, 8, 2],
};

type DataRange = 'weekly' | 'monthly' | 'yearly';

const DoctorStats = () => {
  const theme = useTheme();
  const [range, setRange] = useState<DataRange>('weekly');

  const getLabels = () => {
    if (range === 'weekly') {
      return mockConsultationData.labels;
    } else if (range === 'monthly') {
      return Array.from({ length: 28 }, (_, i) => (i + 1).toString());
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  };

  const getData = () => {
    return mockConsultationData[range];
  };

  const consultationChartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Consultations',
        data: getData(),
        borderColor: theme.palette.primary.main,
        backgroundColor: 'transparent',
        tension: 0.3,
      },
    ],
  };

  const consultationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const issueTypeChartData = {
    labels: mockIssueTypeData.labels,
    datasets: [
      {
        data: mockIssueTypeData.data,
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.primary.light,
          theme.palette.secondary.main,
          theme.palette.secondary.light,
          theme.palette.info.main,
          theme.palette.info.light,
        ],
        borderWidth: 0,
      },
    ],
  };

  const issueTypeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  const feedbackChartData = {
    labels: mockFeedbackData.labels,
    datasets: [
      {
        data: mockFeedbackData.data,
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.success.light,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  const feedbackChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Consultation Activity
            </Typography>
            
            <ButtonGroup size="small">
              <Button 
                variant={range === 'weekly' ? 'contained' : 'outlined'} 
                onClick={() => setRange('weekly')}
              >
                Week
              </Button>
              <Button 
                variant={range === 'monthly' ? 'contained' : 'outlined'} 
                onClick={() => setRange('monthly')}
              >
                Month
              </Button>
              <Button 
                variant={range === 'yearly' ? 'contained' : 'outlined'} 
                onClick={() => setRange('yearly')}
              >
                Year
              </Button>
            </ButtonGroup>
          </Box>
          
          <Box sx={{ height: 240 }}>
            <Line data={consultationChartData} options={consultationChartOptions} />
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Consultations</Typography>
              <Typography variant="h6" fontWeight="bold">
                {range === 'weekly' ? 30 : range === 'monthly' ? 120 : 312}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Average/Day</Typography>
              <Typography variant="h6" fontWeight="bold">
                {range === 'weekly' ? 4.3 : range === 'monthly' ? 4.0 : 4.2}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                98%
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Health Issue Distribution
          </Typography>
          
          <Box sx={{ height: 240 }}>
            <Doughnut data={issueTypeChartData} options={issueTypeChartOptions} />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Patient Feedback
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={7}>
              <Box sx={{ height: 160, position: 'relative' }}>
                <Doughnut data={feedbackChartData} options={feedbackChartOptions} />
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    4.5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg. Rating
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={5}>
              {feedbackChartData.labels.map((label, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: feedbackChartData.datasets[0].backgroundColor[index],
                      mr: 1,
                    }} 
                  />
                  <Typography variant="caption">
                    {label}: {feedbackChartData.datasets[0].data[index]}%
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Monthly Trend by Issue Type
          </Typography>
          
          <Box sx={{ height: 160 }}>
            <Bar 
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'NHM',
                    data: [12, 15, 18, 14, 20, 16],
                    backgroundColor: theme.palette.primary.main,
                  },
                  {
                    label: 'Ayush',
                    data: [8, 10, 12, 15, 10, 14],
                    backgroundColor: theme.palette.secondary.main,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: theme.palette.divider,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorStats;