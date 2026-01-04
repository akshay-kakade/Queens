import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, CircularProgress, Toolbar } from '@mui/material';
import { 
  Inventory as InventoryIcon, 
  AttachMoney as MoneyIcon, 
  ShoppingCart as OrderIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import api from '../../services/api';

const TenantDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/tenant/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch tenant stats", error);
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
            <Navbar role="tenant" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 1 }}>
                    {stats?.shop_name || 'My Boutique'}
                </Typography>
                
                {stats && !stats.is_approved && (
                    <Box sx={{ 
                        mb: 4, p: 3, 
                        bgcolor: 'rgba(212, 175, 55, 0.05)', 
                        borderRadius: 4, 
                        border: '1px solid rgba(212, 175, 55, 0.3)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <WarningIcon sx={{ color: '#D4AF37', fontSize: 32 }} />
                        <Box>
                            <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold' }}>PENDING ROYAL APPROVAL</Typography>
                            <Typography variant="body2" color="text.secondary">Your boutique is currently in review. Once approved, it will be visible in the <span style={{ color: '#D4AF37' }}>Queens Mall</span> collection. Product management is currently limited.</Typography>
                        </Box>
                    </Box>
                )}

                <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 300 }}>
                    Welcome to your command center. Here is your boutique's performance today.
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="TOTAL PRODUCTS" 
                            value={stats?.total_products || 0} 
                            icon={<InventoryIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="ACTIVE ORDERS" 
                            value={stats?.recent_orders || 0} 
                            icon={<OrderIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="TOTAL REVENUE" 
                            value={`$${stats?.total_sales?.toLocaleString()}`} 
                            icon={<MoneyIcon />} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard 
                            title="STOCK ALERTS" 
                            value={stats?.low_stock || 0} 
                            icon={<WarningIcon />} 
                        />
                    </Grid>
                </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default TenantDashboard;
