import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, bgcolor: 'background.paper' }}>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              backgroundColor: 'rgba(212, 175, 55, 0.1)', 
              borderRadius: 3, 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#D4AF37' 
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
