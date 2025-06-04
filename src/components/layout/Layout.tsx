import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Container, 
  Avatar, 
  Tooltip, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Home as HomeIcon,
  HealthAndSafety as HealthIcon,
  CalendarMonth as CalendarIcon, 
  Person as PersonIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  VideoCall as VideoCallIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Heart, Users, BadgeHelp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleCloseUserMenu();
  };

  const userMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/user/dashboard' },
    { text: 'Request Consultation', icon: <VideoCallIcon />, path: '/user/request-consultation' },
    { text: 'My Consultations', icon: <HistoryIcon />, path: '/user/my-consultations' },
    { text: 'Health Profile', icon: <PersonIcon />, path: '/user/health-profile' },
  ];

  const doctorMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
    { text: 'My Schedule', icon: <CalendarIcon />, path: '/doctor/schedule' },
    { text: 'Patients', icon: <Users />, path: '/doctor/patients' },
  ];

  const menuItems = user?.role === 'doctor' ? doctorMenuItems : userMenuItems;

  const notificationItems = [
    {
      id: 1,
      title: 'Upcoming Appointment',
      message: 'You have a consultation with Dr. Lakshmi Nair tomorrow at 10:00 AM',
      time: '5 min ago',
    },
    {
      id: 2,
      title: 'Prescription Ready',
      message: 'Your prescription for the last consultation is ready',
      time: '1 hour ago',
    },
    {
      id: 3,
      title: 'Feedback Request',
      message: 'Please provide feedback for your recent consultation',
      time: '1 day ago',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            
            <Heart 
              size={28} 
              fill="#fff" 
              stroke="#fff" 
              strokeWidth={2}
              style={{ marginRight: '8px' }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Loka Health Connect
            </Typography>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Change language">
                <IconButton sx={{ ml: 1, color: 'white' }}>
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleOpenNotifications} 
                  sx={{ ml: 1, color: 'white' }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-notifications"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
              >
                {notificationItems.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={handleCloseNotifications}
                    sx={{ 
                      width: 300,
                      whiteSpace: 'normal',
                      py: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleCloseNotifications}>
                  <Typography variant="body2" fontWeight={500} color="primary" textAlign="center" sx={{ width: '100%' }}>
                    View all notifications
                  </Typography>
                </MenuItem>
              </Menu>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                {!isMobile && (
                  <Typography variant="body2" sx={{ mr: 1, color: 'white' }}>
                    {user?.name}
                  </Typography>
                )}
                <Tooltip title="Open user menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user?.name} 
                      src={user?.avatar} 
                      sx={{ width: 40, height: 40 }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '0 24px 24px 0',
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? 'white' : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<BadgeHelp />}
              fullWidth
              sx={{ 
                borderRadius: 2,
                py: 1,
                justifyContent: 'flex-start',
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
              }}
            >
              Help & Support
            </Button>
          </Box>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;