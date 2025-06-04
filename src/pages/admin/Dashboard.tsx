import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
} from '@mui/icons-material';
import {
  Users,
  Activity,
  DollarSign,
  Star,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const theme = useTheme();
  const { stats, settings } = useAdmin();
  
  // Chart colors
  const chartColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  // Quick stats cards data
  const quickStats = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <Users />,
      color: 'primary',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <Activity />,
      color: 'secondary',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Revenue',
      value: `$${stats.revenueThisMonth}`,
      icon: <DollarSign />,
      color: 'success',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Patient Satisfaction',
      value: `${stats.patientSatisfaction}%`,
      icon: <Star />,
      color: 'warning',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Average Wait Time',
      value: `${stats.averageWaitTime} min`,
      icon: <Clock />,
      color: 'info',
      trend: '-10%',
      trendUp: false,
    },
    {
      title: 'Emergency Cases',
      value: stats.emergencyCases,
      icon: <AlertTriangle />,
      color: 'error',
      trend: '+3%',
      trendUp: true,
    },
  ];

  // Monthly revenue data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 16000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 19000 },
  ];

  // Patient demographics data
  const patientDemographics = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 30 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 20 },
    { name: '55+', value: 10 },
  ];

  // Consultation trends data
  const consultationTrends = [
    { date: 'Mon', nhm: 25, ayush: 15 },
    { date: 'Tue', nhm: 30, ayush: 20 },
    { date: 'Wed', nhm: 28, ayush: 22 },
    { date: 'Thu', nhm: 32, ayush: 18 },
    { date: 'Fri', nhm: 35, ayush: 25 },
    { date: 'Sat', nhm: 20, ayush: 15 },
    { date: 'Sun', nhm: 15, ayush: 10 },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitor and manage your healthcare platform's performance and settings.
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                        {stat.value}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {stat.trendUp ? (
                          <TrendingUp fontSize="small" color="success" />
                        ) : (
                          <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography
                          variant="body2"
                          color={stat.trendUp ? 'success.main' : 'error.main'}
                        >
                          {stat.trend} this month
                        </Typography>
                      </Stack>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}.light`,
                        color: `${stat.color}.main`,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Revenue Overview
                </Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill={chartColors.primary} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Demographics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Patient Demographics
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={patientDemographics}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {patientDemographics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(chartColors)[index % Object.values(chartColors).length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Consultation Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Consultation Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nhm"
                    stroke={chartColors.primary}
                    name="NHM Consultations"
                  />
                  <Line
                    type="monotone"
                    dataKey="ayush"
                    stroke={chartColors.secondary}
                    name="Ayush Consultations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Doctor Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Top Performing Doctors
              </Typography>
              <Grid container spacing={2}>
                {stats.doctorPerformance.map((doctor, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={`https://i.pravatar.cc/150?img=${index + 1}`}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {doctor.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Star size={16} color={theme.palette.warning.main} />
                              <Typography variant="body2">{doctor.rating}</Typography>
                            </Stack>
                          </Box>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Consultations
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {doctor.consultations}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Revenue
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                ${doctor.revenue}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Calendar />}
                    sx={{ py: 2 }}
                  >
                    Manage Schedules
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileText />}
                    sx={{ py: 2 }}
                  >
                    View Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Users />}
                    sx={{ py: 2 }}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Settings />}
                    sx={{ py: 2 }}
                  >
                    System Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;