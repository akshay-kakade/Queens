import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Collapse, IconButton, CircularProgress, Grid, Toolbar, Container, Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const OrderRow = ({ order, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await api.put(`/tenant/orders/${order.id}/status`, { status: newStatus });
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: '#D4AF37' }}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>#{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.contact_number || 'N/A'}</TableCell>
                <TableCell>
                     <Chip 
                        label={order.status.toUpperCase()} 
                        sx={{ 
                            bgcolor: order.status === 'Completed' ? 'rgba(76,175,80,0.1)' : 'rgba(212,175,55,0.1)', 
                            color: order.status === 'Completed' ? '#4caf50' : '#D4AF37',
                            border: `1px solid ${order.status === 'Completed' ? '#4caf50' : '#D4AF37'}`,
                            fontWeight: 'bold',
                            fontSize: '0.65rem',
                            letterSpacing: 1
                        }} 
                        size="small" 
                    />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#D4AF37', fontSize: '1.1rem' }}>
                    ${order.total_revenue.toFixed(2)}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 3, p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                    ORDER MANIFEST
                                </Typography>
                                
                                {order.status === 'Pending' && (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button 
                                            variant="outlined" 
                                            color="error"
                                            size="small"
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus('Cancelled')}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Cancel Order
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="success"
                                            size="small"
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus('Completed')}
                                            sx={{ 
                                                borderRadius: 2, 
                                                textTransform: 'none',
                                                bgcolor: '#4caf50',
                                                '&:hover': { bgcolor: '#388e3c' }
                                            }}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={4} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>DELIVERY ADDRESS</Typography>
                                    <Typography variant="body2">{order.delivery_address || 'Collection point pending'}</Typography>
                                </Grid>
                                {order.delivery_time && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mb: 0.5, fontWeight: 'bold' }}>PREFERRED SCHEDULE</Typography>
                                        <Typography variant="body2">{new Date(order.delivery_time).toLocaleString()}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                            
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>PRODUCT</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>QTY</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>UNIT PRICE</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>SUBTOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.product_name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">${item.price}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${item.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const TenantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/tenant/orders');
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="tenant" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 5 }}>Incoming Orders</Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress sx={{ color: '#D4AF37' }} />
                    </Box>
                ) : orders.length > 0 ? (
                    <TableContainer 
                        component={Paper} 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 4, 
                            bgcolor: 'background.paper', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'var(--premium-shadow)',
                            overflow: 'hidden'
                        }}
                    >
                        <Table>
                            <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableRow>
                                    <TableCell />
                                    <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>ORDER ID</TableCell>
                                    <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>DATE</TableCell>
                                    <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>CONTACT</TableCell>
                                    <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>REVENUE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <OrderRow key={order.id} order={order} onUpdate={fetchOrders} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Paper sx={{ 
                        p: 8, 
                        textAlign: 'center', 
                        bgcolor: 'background.paper', 
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                            No orders manifest yet. Excellence takes time.
                        </Typography>
                    </Paper>
                )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default TenantOrders;
