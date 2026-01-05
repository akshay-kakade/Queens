import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Navbar role="customer" />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 4,
              backdropFilter: 'blur(12px)',
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
              animation: 'popIn 0.5s ease-out',
              '@keyframes popIn': {
                from: { transform: 'scale(0.9)', opacity: 0 },
                to: { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            {/* Success Icon */}
            <CheckCircleRounded
              sx={{
                fontSize: 110,
                color: '#2e7d32',
                mb: 2,
              }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: '#2e7d32', mb: 1 }}
            >
              Order Placed Successfully
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Thanks for shopping with us. Your order is confirmed and being
              processed.
            </Typography>

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/customer')}
              >
                Return Home
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/customer/profile')}
              >
                View Orders
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default OrderSuccess;
