import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  BarChart as BarChartIcon, 
  Store as StoreIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = {
    admin: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
      { text: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
      { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
      { text: 'Tenants', icon: <StoreIcon />, path: '/admin/tenants' },
    ],
    tenant: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/tenant' },
      { text: 'Inventory', icon: <StoreIcon />, path: '/tenant/inventory' },
      { text: 'Orders', icon: <ShoppingCartIcon />, path: '/tenant/orders' },
      { text: 'Shop Profile', icon: <PersonIcon />, path: '/tenant/profile' },
    ],
    customer: [
      { text: 'Home', icon: <DashboardIcon />, path: '/customer' },
      { text: 'Explore Shops', icon: <StoreIcon />, path: '/customer/explore' },
      { text: 'My Cart', icon: <ShoppingCartIcon />, path: '/customer/cart' },
      { text: 'My Profile', icon: <PersonIcon />, path: '/customer/profile' },
    ]
  };

  const currentItems = menuItems[role] || [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuContent = (
    <List>
      {currentItems.map((item) => (
        <ListItem 
          button 
          key={item.text} 
          onClick={() => {
            navigate(item.path);
            if (isMobile) setMobileOpen(false);
          }}
          selected={location.pathname === item.path}
          sx={{
            color: location.pathname === item.path ? '#D4AF37' : 'inherit',
            '&.Mui-selected': { bgcolor: 'rgba(212, 175, 55, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      <ListItem button onClick={logout} sx={{ color: '#ff5252' }}>
        <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(11, 16, 32, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Queens Mall Logo" 
            onClick={() => navigate(`/${role}`)}
            sx={{ height: 60, cursor: 'pointer', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
          />

          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon sx={{ color: '#D4AF37' }} />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {currentItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? '#D4AF37' : '#ffffff',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    borderBottom: location.pathname === item.path ? '2px solid #D4AF37' : '2px solid transparent',
                    borderRadius: 0
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Button 
                onClick={logout} 
                startIcon={<LogoutIcon />}
                sx={{ 
                  color: '#ff5252', 
                  ml: 2,
                  '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.1)' }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { bgcolor: '#0B1020', width: 250, color: '#ffffff' }
        }}
      >
        <Toolbar />
        {menuContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
