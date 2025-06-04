import { useState } from 'react';
import { Box, Typography, Button, ButtonGroup, useTheme } from '@mui/material';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const mockStressData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekly: [4, 6, 5, 7, 4, 3, 2],
  monthly: [5, 7, 6, 4, 3, 5, 4, 6, 5, 3, 4, 5, 6, 7, 5, 4, 3, 5, 4, 3, 5, 6, 4, 3, 4, 5, 3, 4],
  yearly: [4, 5, 3, 4, 5, 6, 4, 3, 4, 5, 6, 4],
};

const mockSleepData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekly: [6.5, 7, 6.2, 8, 7.5, 9, 8.5],
  monthly: [7, 6.5, 7, 8, 7.5, 6, 6.5, 7, 8, 7.5, 6, 6.5, 7, 7.5, 8, 7, 6.5, 6, 7.5, 8, 7, 6.5, 7, 8, 7.5, 8, 7, 6.5],
  yearly: [7.2, 6.8, 7.5, 7.1, 6.9, 7.3, 7.4, 7.0, 6.7, 7.2, 7.5, 7.8],
};

const mockMedicationData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekly: [100, 100, 80, 100, 100, 100, 80],
  monthly: [90, 85, 90, 100, 95, 85, 90, 100, 85, 90, 100, 95, 90, 85, 90, 100, 95, 90, 85, 90, 100, 95, 90, 100, 95, 90, 100, 95],
  yearly: [92, 88, 95, 90, 87, 93, 91, 89, 94, 92, 90, 93],
};

type DataRange = 'weekly' | 'monthly' | 'yearly';
type DataType = 'stress' | 'sleep' | 'medication';

const HealthStats = () => {
  const theme = useTheme();
  const [range, setRange] = useState<DataRange>('weekly');
  const [dataType, setDataType] = useState<DataType>('stress');

  const getLabels = () => {
    if (range === 'weekly') {
      return mockStressData.labels;
    } else if (range === 'monthly') {
      return Array.from({ length: 28 }, (_, i) => (i + 1).toString());
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
  };

  const getData = () => {
    if (dataType === 'stress') {
      return mockStressData[range];
    } else if (dataType === 'sleep') {
      return mockSleepData[range];
    } else {
      return mockMedicationData[range];
    }
  };

  const getDatasetLabel = () => {
    if (dataType === 'stress') {
      return 'Stress Level (1-10)';
    } else if (dataType === 'sleep') {
      return 'Sleep Hours';
    } else {
      return 'Medication Adherence (%)';
    }
  };

  const getChartColor = () => {
    if (dataType === 'stress') {
      return theme.palette.error.main;
    } else if (dataType === 'sleep') {
      return theme.palette.info.main;
    } else {
      return theme.palette.success.main;
    }
  };

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: getDatasetLabel(),
        data: getData(),
        borderColor: getChartColor(),
        backgroundColor: dataType === 'medication' 
          ? getChartColor() + '80'
          : 'transparent',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
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
        beginAtZero: dataType === 'stress' || dataType === 'medication',
        min: dataType === 'sleep' ? 0 : undefined,
        max: dataType === 'stress' ? 10 : dataType === 'medication' ? 100 : undefined,
        ticks: {
          stepSize: dataType === 'stress' ? 2 : dataType === 'medication' ? 20 : 2,
        },
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ButtonGroup size="small">
          <Button 
            variant={dataType === 'stress' ? 'contained' : 'outlined'} 
            onClick={() => setDataType('stress')}
            color="error"
          >
            Stress
          </Button>
          <Button 
            variant={dataType === 'sleep' ? 'contained' : 'outlined'} 
            onClick={() => setDataType('sleep')}
            color="info"
          >
            Sleep
          </Button>
          <Button 
            variant={dataType === 'medication' ? 'contained' : 'outlined'} 
            onClick={() => setDataType('medication')}
            color="success"
          >
            Medication
          </Button>
        </ButtonGroup>

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

      <Box sx={{ height: 300, mt: 2 }}>
        {dataType === 'medication' ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Average</Typography>
          <Typography variant="h6" fontWeight="bold">
            {dataType === 'stress' 
              ? '4.5/10' 
              : dataType === 'sleep' 
                ? '7.2 hrs' 
                : '92%'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Trend</Typography>
          <Typography variant="h6" fontWeight="bold" color={
            dataType === 'stress' 
              ? 'error.main' 
              : dataType === 'sleep' 
                ? 'success.main' 
                : 'success.main'
          }>
            {dataType === 'stress' 
              ? '-12%' 
              : dataType === 'sleep' 
                ? '+8%' 
                : '+5%'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Goal</Typography>
          <Typography variant="h6" fontWeight="bold">
            {dataType === 'stress' 
              ? '< 3/10' 
              : dataType === 'sleep' 
                ? '8 hrs' 
                : '100%'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HealthStats;