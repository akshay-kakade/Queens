import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Container, CircularProgress, 
    Card, CardMedia, Avatar, Chip, IconButton, Snackbar, Alert, Toolbar
} from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const [shopRes, productsRes, wishlistRes] = await Promise.all([
                    api.get(`/customer/shops/${shopId}`),
                    api.get(`/customer/shops/${shopId}/products`),
                    api.get('/customer/wishlist')
                ]);
                setShop(shopRes.data);
                setProducts(productsRes.data);
                if (Array.isArray(wishlistRes.data)) {
                    setWishlistIds(new Set(wishlistRes.data.map(item => item.product_id || item.id)));
                }
            } catch (error) {
                console.error("Failed to fetch shop details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [shopId]);

    const handleToggleWishlist = async (product) => {
        try {
            const isWishlisted = wishlistIds.has(product.id);
            if (isWishlisted) {
                await api.delete('/customer/wishlist', { data: { product_id: product.id } });
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.delete(product.id);
                    return next;
                });
                setToast({ open: true, message: 'Removed from wishlist', severity: 'info' });
            } else {
                await api.post('/customer/wishlist', { product_id: product.id });
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.add(product.id);
                    return next;
                });
                setToast({ open: true, message: 'Added to wishlist', severity: 'success' });
            }
        } catch (error) {
            console.error("Wishlist toggle failed", error);
            setToast({ open: true, message: 'Action failed', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: '#D4AF37' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="customer" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="md">
                    <IconButton onClick={() => navigate(-1)} sx={{ mb: 3, color: '#D4AF37' }}>
                        <ArrowBack />
                    </IconButton>

                    {/* Shop Header */}
                    <Card sx={{ 
                        mb: 6, 
                        borderRadius: 6, 
                        overflow: 'visible',
                        bgcolor: 'background.paper',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: 'var(--premium-shadow)',
                        position: 'relative'
                    }}>
                        <Box sx={{ position: 'relative', height: 280, borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
                            <CardMedia 
                                component="img" 
                                height="280" 
                                image={shop?.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"} 
                                sx={{ objectFit: 'cover' }}
                            />
                            <Box sx={{ 
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(11,16,32,0.9) 100%)'
                            }} />
                            <Avatar 
                                sx={{ 
                                    width: 100, height: 100, // Reduced size for scaling
                                    position: 'absolute', bottom: -50, left: '50%', 
                                    transform: 'translateX(-50%)',
                                    border: '4px solid #0F172A', 
                                    bgcolor: '#D4AF37', 
                                    color: '#0B1020',
                                    fontSize: 40,
                                    fontWeight: 'bold',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    zIndex: 2
                                }}
                            >
                                {shop?.shop_name?.[0]}
                            </Avatar>
                        </Box>
                        <Box sx={{ pt: 10, px: 6, pb: 6 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography variant="h3" sx={{ mb: 1.5 }}>
                                        {shop?.shop_name || "Shop Details"}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                        <Chip 
                                            label={(shop?.category || "General").toUpperCase()} 
                                            sx={{ 
                                                bgcolor: 'rgba(212,175,55,0.1)', 
                                                color: '#D4AF37', 
                                                fontWeight: 'bold',
                                                fontSize: '0.7rem',
                                                letterSpacing: 1,
                                                border: '1px solid rgba(212,175,55,0.3)'
                                            }} 
                                        />
                                        <Chip 
                                            label="OPEN FOR BUSINESS" 
                                            sx={{ 
                                                bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                                color: '#4caf50', 
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                letterSpacing: 1
                                            }} 
                                            size="small" 
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300, maxWidth: 800, lineHeight: 1.6 }}>
                                {shop?.description || "Welcome to our exclusive boutique. Experience world-class shopping with our curated selection of premium products."}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Product Grid */}
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, letterSpacing: 1 }}>EXQUISITE COLLECTION</Typography>
                    <Grid container spacing={4}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                    <Box sx={{ position: 'relative', height: '100%' }}>
                                        <ProductCard product={product} />
                                        <IconButton 
                                            sx={{ 
                                                position: 'absolute', top: 15, right: 15, 
                                                bgcolor: 'rgba(11, 16, 32, 0.8)', 
                                                backdropFilter: 'blur(4px)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: wishlistIds.has(product.id) ? '#D4AF37' : 'white',
                                                '&:hover': { 
                                                    bgcolor: 'rgba(212, 175, 55, 0.2)',
                                                    color: '#D4AF37'
                                                }
                                            }}
                                            onClick={() => handleToggleWishlist(product)}
                                        >
                                            {wishlistIds.has(product.id) ? 
                                                <Favorite /> : 
                                                <FavoriteBorder />
                                            }
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ py: 10, textAlign: 'center' }}>
                                    <Typography color="text.secondary" variant="h6" sx={{ fontWeight: 300 }}>
                                        No items currently available in this collection.
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    <Snackbar 
                        open={toast.open} 
                        autoHideDuration={3000} 
                        onClose={() => setToast({ ...toast, open: false })}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert 
                            onClose={() => setToast({ ...toast, open: false })} 
                            severity={toast.severity} 
                            sx={{ 
                                width: '100%',
                                bgcolor: '#0B1020',
                                color: toast.severity === 'success' ? '#D4AF37' : 'white',
                                border: `1px solid ${toast.severity === 'success' ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`
                            }}
                        >
                            {toast.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default ShopDetails;
