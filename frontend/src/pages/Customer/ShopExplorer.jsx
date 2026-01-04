import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, CardActionArea, CardMedia,
    Toolbar, TextField, InputAdornment, Chip, CircularProgress, Container
} from '@mui/material';
import { Search as SearchIcon, Store as ShopIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const ShopExplorer = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Fashion', 'Electronics', 'Food', 'General'];

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await api.get('/customer/shops');
                setShops(response.data);
            } catch (error) {
                console.error("Error fetching shops", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (shop.category && shop.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleShopClick = (shop) => {
        // Navigate to shop details/products (reusing home logic assumption or new route)
        // For now, let's keep it simple or maybe open a dialog?
        // Actually, CustomerHome used setSelectedShop. Here we might need a route like /customer/shop/:id
        // But for consistency with Home, let's just log it for now or assume we'll build a ShopDetails page.
        // Let's pass state or assume we will build /customer/shop/:id
        navigate(`/customer/shop/${shop.id}`, { state: { shop } });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="customer" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>
                            Shop Explorer
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                            Discover elite boutiques and exclusive brands in <span style={{ color: '#D4AF37', fontWeight: 600 }}>Queens Mall</span>
                        </Typography>
                    </Box>

                    {/* Search and Filter */}
                    <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            placeholder="Search by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#D4AF37' }} />
                                    </InputAdornment>
                                ),
                                disableUnderline: true
                            }}
                            sx={{ 
                                bgcolor: 'background.paper', 
                                borderRadius: 3,
                                '& .MuiFilledInput-root': {
                                    p: 1,
                                    bgcolor: 'background.paper',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                                    '&.Mui-focused': { border: '1px solid #D4AF37' }
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            {categories.map((cat) => (
                                <Chip
                                    key={cat}
                                    label={cat.toUpperCase()}
                                    clickable
                                    onClick={() => setSelectedCategory(cat)}
                                    sx={{ 
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        letterSpacing: 1,
                                        borderRadius: 2,
                                        bgcolor: selectedCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                        color: selectedCategory === cat ? '#0B1020' : 'text.secondary',
                                        border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            bgcolor: selectedCategory === cat ? '#B8962E' : 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                            <CircularProgress sx={{ color: '#D4AF37' }} />
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {filteredShops.length > 0 ? (
                                filteredShops.map((shop) => (
                                    <Grid item key={shop.id} xs={12} sm={6} md={4} lg={3}>
                                        <Card 
                                            elevation={0} 
                                            sx={{ 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                bgcolor: 'background.paper',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': { 
                                                    transform: 'translateY(-10px)', 
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                                    borderColor: 'rgba(212, 175, 55, 0.3)'
                                                }
                                            }}
                                        >
                                            <CardActionArea onClick={() => handleShopClick(shop)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                                <Box sx={{ position: 'relative', height: 200 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={shop.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"}
                                                        alt={shop.shop_name}
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{ 
                                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                        background: 'linear-gradient(to bottom, transparent 0%, rgba(11,16,32,0.8) 100%)'
                                                    }} />
                                                </Box>
                                                
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {shop.shop_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1.5, display: 'block', mb: 1.5 }}>
                                                        {(shop.category || 'General').toUpperCase()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        fontWeight: 300,
                                                        lineHeight: 1.6
                                                    }}>
                                                        {shop.description || "Indulge in an exclusive collection of luxury items and premium services."}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box sx={{ textAlign: 'center', py: 12 }}>
                                        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300 }}>
                                            No boutiques found matching your criteria.
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default ShopExplorer;
