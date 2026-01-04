import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, TextField, Button, Avatar, Paper, 
    Grid, Toolbar, Alert, CircularProgress, Container
} from '@mui/material';
import { Save as SaveIcon, Store as StoreIcon } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const TenantProfile = () => {
    const [formData, setFormData] = useState({
        shop_name: '',
        category: '',
        description: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/tenant/stats'); // Stats includes profile info now
                const data = response.data;
                setFormData({
                    shop_name: data.shop_name || '',
                    category: data.category || '',
                    description: data.description || '',
                    image_url: data.image_url || ''
                });
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setMessage({ type: '', text: '' });
        try {
            await api.put('/tenant/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    if (loading) return <Box p={3}><CircularProgress /></Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="tenant" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 5 }}>
                    Boutique Profile
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ 
                            p: 5, 
                            borderRadius: 6, 
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'var(--premium-shadow)'
                        }}>
                            {message.text && (
                                <Alert severity={message.type} sx={{ 
                                    mb: 4, 
                                    bgcolor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                                    color: message.type === 'success' ? '#4caf50' : '#d32f2f',
                                    border: `1px solid ${message.type === 'success' ? '#4caf50' : '#d32f2f'}`,
                                    borderRadius: 2
                                }}>
                                    {message.text}
                                </Alert>
                            )}
                            
                            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Avatar 
                                    src={formData.image_url} 
                                    sx={{ 
                                        width: 120, height: 120, 
                                        bgcolor: '#D4AF37', 
                                        border: '4px solid #0F172A',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                        fontSize: 50,
                                        color: '#0B1020'
                                    }}
                                >
                                    {!formData.image_url && <StoreIcon fontSize="inherit" />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>BOUTIQUE IDENTITY</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Represent your brand's excellence with a high-quality storefront image.
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="BOUTIQUE NAME"
                                        name="shop_name"
                                        fullWidth
                                        variant="filled"
                                        value={formData.shop_name}
                                        onChange={handleChange}
                                        sx={{ 
                                            '& .MuiFilledInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="COLLECTION CATEGORY"
                                        name="category"
                                        fullWidth
                                        variant="filled"
                                        value={formData.category}
                                        onChange={handleChange}
                                        sx={{ 
                                            '& .MuiFilledInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="THE BOUTIQUE STORY"
                                        name="description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        value={formData.description}
                                        onChange={handleChange}
                                        sx={{ 
                                            '& .MuiFilledInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                                        }}
                                        helperText="Craft a compelling narrative for your elite clientele."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="STOREFRONT IMAGE URL"
                                        name="image_url"
                                        fullWidth
                                        variant="filled"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        sx={{ 
                                            '& .MuiFilledInput-root': { bgcolor: 'rgba(255,255,255,0.03)' }
                                        }}
                                        helperText="A direct link to your boutique's visual presence."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        size="large" 
                                        startIcon={<SaveIcon />}
                                        onClick={handleSubmit}
                                        sx={{ 
                                            py: 1.5, px: 4, 
                                            borderRadius: 2,
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                            color: '#0B1020',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)',
                                            }
                                        }}
                                    >
                                        SAVE EXCLUSIVITY
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default TenantProfile;
