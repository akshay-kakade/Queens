import React from 'react';
import { Box, Container, Typography, IconButton, Grid, Divider, Link } from '@mui/material';
import { GitHub, Instagram, LinkedIn, Favorite } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#0B1020', 
        color: '#ffffff', 
        py: 6, 
        mt: 'auto',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Element */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: '1px', 
        background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
        opacity: 0.5
      }} />

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
          <Grid item xs={12}>
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Queens Mall Logo" 
              sx={{ height: 50, mb: 2, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Cinzel, serif', 
                color: '#D4AF37', 
                letterSpacing: 2,
                mb: 1
              }}
            >
              QUEENS CLUB
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, maxWidth: 600, mx: 'auto', mb: 3 }}>
              The ultimate destination for luxury retail and exclusive experiences. 
              Redefining the standard of elegance and sophistication.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
              <IconButton 
                component="a" 
                href="https://github.com/akshay-kakade" 
                target="_blank"
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { color: '#D4AF37', border: '1px solid #D4AF37', transform: 'translateY(-3px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.instagram.com/maverick_7821" 
                target="_blank"
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { color: '#D4AF37', border: '1px solid #D4AF37', transform: 'translateY(-3px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.linkedin.com/in/akshay-kakade-860224356/" 
                target="_blank"
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { color: '#D4AF37', border: '1px solid #D4AF37', transform: 'translateY(-3px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Cinzel, serif', 
                color: '#ffffff',
                mb: 1
              }}
            >
              Developed By <span style={{ color: '#D4AF37' }}>Akshay Kakade</span> & <span style={{ color: '#D4AF37' }}>Maverick Jones</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              © 2026 Queens Mall. All Rights Reserved. Made with <Favorite sx={{ fontSize: 14, color: '#ff5252' }} /> in India.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
