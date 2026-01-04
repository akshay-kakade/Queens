import React, { useState } from 'react';
import {
    Box, Typography, Grid, Paper, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, Divider,
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Toolbar
} from '@mui/material';
import { Add, Remove, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    
    // Checkout State
    const [openCheckout, setOpenCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        phone: '',
        address: '',
        deliveryDate: ''
    });

    const handleInputChange = (e) => {
        setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({ id: item.id, quantity: item.quantity }));
            
            // Format delivery info
            const deliveryPayload = {
                contact: `${checkoutData.name} (${checkoutData.phone})`,
                address: `${checkoutData.address}`, 
                delivery_time: checkoutData.deliveryDate ? new Date(checkoutData.deliveryDate).toISOString() : null
            };

            await api.post('/customer/orders', { 
                items: orderItems,
                delivery_info: deliveryPayload
            });
            
            clearCart();
            setOpenCheckout(false);
            navigate('/customer/order-success');
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Navbar role="customer" />
                <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Toolbar />
                    <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center', p: 6, borderRadius: 8, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'var(--premium-shadow)' }}>
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>Your Bag is Empty</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 300 }}>Experience the finest collections. Start your journey.</Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => navigate('/customer/explore')}
                            sx={{ 
                                px: 6, py: 1.5, borderRadius: 2, fontWeight: 'bold', letterSpacing: 1.5,
                                background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                color: '#0B1020',
                                '&:hover': { background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)' }
                            }}
                        >
                            EXPLORE BOUTIQUES
                        </Button>
                    </Box>
                </Container>
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="customer" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                    <Toolbar />
                    <Button 
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate(-1)} 
                        sx={{ mb: 4, color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}
                    >
                        BACK TO SHOPPING
                    </Button>
                    
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h2" sx={{ mb: 1 }}>Shopping Bag</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                            Review your selection of <span style={{ color: '#D4AF37', fontWeight: 600 }}>Elite Goods</span>
                        </Typography>
                    </Box>

                    <Grid container spacing={5}>
                        <Grid item xs={12} lg={8}>
                            <TableContainer component={Paper} elevation={0} sx={{ 
                                borderRadius: 4, 
                                bgcolor: 'background.paper', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                overflow: 'hidden'
                            }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                            <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1.5, py: 3 }}>PRODUCT</TableCell>
                                            <TableCell align="center" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1.5 }}>QUANTITY</TableCell>
                                            <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1.5 }}>PRICE</TableCell>
                                            <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1.5 }}>SUBTOTAL</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item) => (
                                            <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                        <Box sx={{ 
                                                            width: 80, height: 80, borderRadius: 2, overflow: 'hidden', 
                                                            border: '1px solid rgba(255,255,255,0.05)',
                                                            flexShrink: 0
                                                        }}>
                                                            <img 
                                                                src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200"} 
                                                                alt={item.name} 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>REF: QUEENS-{item.id}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ 
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                        bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, 
                                                        width: 'fit-content', mx: 'auto', p: 0.5,
                                                        border: '1px solid rgba(255,255,255,0.05)'
                                                    }}>
                                                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ color: '#D4AF37' }}><Remove fontSize="small" /></IconButton>
                                                        <Typography sx={{ mx: 2, fontWeight: 'bold', minWidth: 20 }}>{item.quantity}</Typography>
                                                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ color: '#D4AF37' }}><Add fontSize="small" /></IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>${item.price.toLocaleString()}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '1.1rem' }}>${(item.price * item.quantity).toLocaleString()}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="error" onClick={() => removeFromCart(item.id)} sx={{ opacity: 0.4, '&:hover': { opacity: 1, color: '#ff5252' } }}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        
                        <Grid item xs={12} lg={4}>
                            <Paper sx={{ 
                                p: 5, 
                                borderRadius: 6, 
                                bgcolor: '#0B1020',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                boxShadow: 'var(--premium-shadow)',
                                position: 'relative'
                            }}>
                                <Typography variant="h4" sx={{ mb: 4, letterSpacing: 1 }}>Summary</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                                    <Typography color="text.secondary" sx={{ fontWeight: 300 }}>Subtotal</Typography>
                                    <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>${cartTotal.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                    <Typography color="text.secondary" sx={{ fontWeight: 300 }}>Luxury Surcharge (10%)</Typography>
                                    <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>${(cartTotal * 0.1).toLocaleString()}</Typography>
                                </Box>
                                <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, alignItems: 'flex-end' }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 300 }}>Total Price</Typography>
                                    <Typography variant="h3" sx={{ color: '#D4AF37', fontWeight: 900 }}>
                                        ${(cartTotal * 1.1).toLocaleString()}
                                    </Typography>
                                </Box>
                                
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    size="large" 
                                    onClick={() => setOpenCheckout(true)} 
                                    disabled={loading}
                                    sx={{ 
                                        py: 2.5, 
                                        fontWeight: '900', 
                                        fontSize: '0.9rem',
                                        letterSpacing: 2,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                        color: '#0B1020',
                                        boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    BEGIN SECURE CHECKOUT
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                    
                    {/* Checkout Dialog */}
                    <Dialog 
                        open={openCheckout} 
                        onClose={() => setOpenCheckout(false)} 
                        maxWidth="sm" 
                        fullWidth
                        PaperProps={{
                            sx: {
                                bgcolor: '#0B1020',
                                backgroundImage: 'none',
                                border: '1px solid rgba(212,175,55,0.2)',
                                borderRadius: 4,
                                p: 2
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: '#D4AF37', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', pb: 0 }}>
                            Checkout Details
                        </DialogTitle>
                        <form onSubmit={handleSubmitOrder}>
                            <DialogContent>
                                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4, fontWeight: 300 }}>
                                    Confirm your delivery details for this <span style={{ color: '#D4AF37' }}>Elite Shipment</span>.
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            name="name"
                                            label="Recipient Name"
                                            fullWidth
                                            variant="filled"
                                            required
                                            value={checkoutData.name}
                                            onChange={handleInputChange}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="phone"
                                            label="Contact Number"
                                            fullWidth
                                            variant="filled"
                                            required
                                            value={checkoutData.phone}
                                            onChange={handleInputChange}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="address"
                                            label="Luxury Delivery Address"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            variant="filled"
                                            required
                                            value={checkoutData.address}
                                            onChange={handleInputChange}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="deliveryDate"
                                            label="Preferred Delivery Window"
                                            type="datetime-local"
                                            fullWidth
                                            variant="filled"
                                            InputLabelProps={{ shrink: true }}
                                            required
                                            value={checkoutData.deliveryDate}
                                            onChange={handleInputChange}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                                <Button 
                                    onClick={() => setOpenCheckout(false)} 
                                    sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}
                                >
                                    ABORT
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={loading}
                                    sx={{ 
                                        px: 6, py: 1.5, fontWeight: 'bold', letterSpacing: 1.5,
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                        color: '#0B1020',
                                        '&:hover': { background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} sx={{ color: '#0B1020' }} /> : "CONFIRM ORDER"}
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default CartPage;
