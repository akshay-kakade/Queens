import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="customer" />
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                <Box 
                    sx={{ 
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '@keyframes popIn': {
                            '0%': { transform: 'scale(0)', opacity: 0 },
                            '100%': { transform: 'scale(1)', opacity: 1 }
                        }
                    }}
                >
                     <img 
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveHR6Z3U4aDhmYjB6MmF6b3hqZm16YjRmYjB6MmF6b3hqZm16YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tf9jjMcO77YzV4YPwE/giphy.gif" 
                        alt="Success Animation" 
                        style={{ width: 250, height: 250, borderRadius: '50%', marginBottom: 20 }} 
                    />
                </Box>
                
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#2e7d32' }}>
                    Order Placed!
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Thank you for your purchase. Your order has been successfully placed.
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={() => navigate('/customer')}>
                        Return Home
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/customer/profile')}>
                        View Orders
                    </Button>
                </Box>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default OrderSuccess;
