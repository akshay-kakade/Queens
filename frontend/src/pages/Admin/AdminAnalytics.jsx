import React, { useEffect, useState } from 'react';
import { Box, Typography, Toolbar, Grid, Container, CircularProgress } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/admin/analytics');
                setTrafficData(response.data.traffic_data);
                setCategoryData(response.data.category_data);
            } catch (error) {
                console.error("Failed to fetch detailed analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: '#D4AF37' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="admin" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 5 }}>
                    Detailed Analytics
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ 
                            height: 450, 
                            bgcolor: 'background.paper', 
                            p: 4, 
                            borderRadius: 4, 
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'var(--premium-shadow)'
                        }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', letterSpacing: 1 }}>WEEKLY FOOTFALL</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={trafficData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #D4AF37', borderRadius: '8px' }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Line type="monotone" dataKey="visits" stroke="#D4AF37" strokeWidth={4} dot={{ r: 6, fill: '#D4AF37' }} activeDot={{ r: 8, stroke: '#F5E6A8', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ 
                            height: 450, 
                            bgcolor: 'background.paper', 
                            p: 4, 
                            borderRadius: 4, 
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'var(--premium-shadow)'
                        }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', letterSpacing: 1 }}>SHOP CATEGORIES</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={[ '#D4AF37', '#B8962E', '#F5E6A8', '#8B7355' ][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #D4AF37', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Grid>
                </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminAnalytics;
