import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, CircularProgress, Toolbar } from '@mui/material';
import { 
  People as PeopleIcon, 
  Store as StoreIcon, 
  AttachMoney as MoneyIcon, 
  EventSeat as OccupancyIcon 
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="admin" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> 
                <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 4 }}>
                    Admin Overview
                </Typography>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="Total Users" 
                            value={stats?.total_users || 0} 
                            icon={<PeopleIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="Total Tenants" 
                            value={stats?.total_tenants || 0} 
                            icon={<StoreIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="Revenue" 
                            value={`$${(stats?.total_revenue || 0).toLocaleString()}`} 
                            icon={<MoneyIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="Occupancy" 
                            value={`${stats?.occupancy_rate || 0}%`} 
                            icon={<OccupancyIcon />} 
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" sx={{ mb: 3 }}>
                    Revenue Analytics
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ height: 400, bgcolor: 'background.paper', p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'var(--premium-shadow)' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.monthly_revenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #D4AF37', borderRadius: '8px' }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ height: 400, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1, overflow: 'auto' }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">Shop Revenue</Typography>
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                <Box component="thead">
                                    <Box component="tr" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box component="th" sx={{ textAlign: 'left', py: 1 }}>Shop</Box>
                                        <Box component="th" sx={{ textAlign: 'right', py: 1 }}>Revenue</Box>
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {(stats?.shop_revenue || []).map((shop, index) => (
                                        <Box component="tr" key={index} sx={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <Box component="td" sx={{ py: 1.5 }}>
                                                <Typography variant="body2" fontWeight="medium">{shop.shop_name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{shop.category}</Typography>
                                            </Box>
                                            <Box component="td" sx={{ textAlign: 'right', py: 1.5 }}>
                                                <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                    ${(shop.revenue || 0).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminDashboard;
