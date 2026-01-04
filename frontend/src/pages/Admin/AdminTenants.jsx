import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Chip, CircularProgress, Container, Button, Toolbar
} from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';


const AdminTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                // Admin needs to see ALL tenants, including unapproved ones
                const res = await api.get('/admin/tenants'); 
                setTenants(res.data);
            } catch (error) {
                console.error("Failed to load tenants", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    const toggleApproval = async (tenantId) => {
        try {
            await api.post(`/admin/tenants/${tenantId}/approve`);
            setTenants(tenants.map(t => 
                t.id === tenantId ? { ...t, is_approved: !t.is_approved } : t
            ));
        } catch (error) {
            console.error("Failed to update approval status", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="admin" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="xl">
                <Container maxWidth="xl">
                    <Toolbar />
                    <Typography variant="h3" sx={{ mb: 5 }}>
                        Tenant Management
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress sx={{ color: '#D4AF37' }} />
                        </Box>
                    ) : (
                        <TableContainer 
                            component={Paper} 
                            sx={{ 
                                borderRadius: 4, 
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: 'var(--premium-shadow)',
                                overflow: 'hidden'
                            }}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>BOUTIQUE</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>CATEGORY</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>SUITE NO.</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>REVENUE</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>STATUS</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>ACTIONS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tenants.map((tenant) => (
                                        <TableRow key={tenant.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar 
                                                        src={tenant.image_url} 
                                                        variant="rounded"
                                                        sx={{ 
                                                            width: 44, height: 44, 
                                                            bgcolor: 'rgba(212,175,55,0.1)',
                                                            color: '#D4AF37',
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        {tenant.shop_name[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {tenant.shop_name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                                            REG. ID: #{tenant.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={tenant.category} 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ borderRadius: 1.5, borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{tenant.shop_number || '--'}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800, color: '#D4AF37', fontSize: '1rem' }}>
                                                ${tenant.account_balance?.toLocaleString() || '0'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={tenant.is_approved ? "APPROVED" : "PENDING"} 
                                                    sx={{ 
                                                        bgcolor: tenant.is_approved ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                                                        color: tenant.is_approved ? '#4caf50' : '#D4AF37',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.65rem',
                                                        letterSpacing: 1,
                                                        border: '1px solid currentColor'
                                                    }} 
                                                    size="small" 
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button 
                                                    size="small" 
                                                    variant={tenant.is_approved ? "outlined" : "contained"} 
                                                    color={tenant.is_approved ? "error" : "primary"}
                                                    onClick={() => toggleApproval(tenant.id)}
                                                    sx={{ minWidth: 100, borderRadius: 2 }}
                                                >
                                                    {tenant.is_approved ? "REVOKE" : "APPROVE"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminTenants;
