import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, Avatar, Divider, Tabs, Tab,
    Card, CardContent, CardMedia, CardActionArea, IconButton,
    Container, CircularProgress, Chip, Button, LinearProgress, Toolbar
} from '@mui/material';
import {
    Person as PersonIcon,
    Favorite as HeartIcon,
    History as HistoryIcon,
    EmojiEvents as LoyaltyIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    LocalOffer as OfferIcon,
    CardGiftcard as GiftIcon,
    Paid as MoneyIcon
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const CustomerProfile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [profile, setProfile] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, wishlistRes, ordersRes] = await Promise.all([
                    api.get('/customer/profile'),
                    api.get('/customer/wishlist'),
                    api.get('/customer/orders')
                ]);
                setProfile(profileRes.data);
                setWishlist(wishlistRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete('/customer/wishlist', { data: { product_id: productId } });
            setWishlist(wishlist.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="customer" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                    {/* Header Section */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, mb: 4, 
                            borderRadius: 6, 
                            background: 'linear-gradient(135deg, #0F172A 0%, #0B1020 100%)', 
                            color: 'white',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }}
                    >
                        <Grid container alignItems="center" spacing={4}>
                            <Grid item>
                                <Avatar 
                                    sx={{ 
                                        width: 100, height: 100, 
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)', 
                                        color: '#0B1020', 
                                        fontSize: 40, 
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                                    }}
                                >
                                    {profile?.username?.[0]?.toUpperCase()}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h3" sx={{ mb: 0.5 }}>{profile?.username}</Typography>
                                <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 300 }}>{profile?.email}</Typography>
                                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip 
                                        icon={<LoyaltyIcon sx={{ color: '#D4AF37 !important' }} />} 
                                        label={`${profile?.loyalty_points || 0} POINTS`} 
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.03)', 
                                            color: 'white', 
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(212, 175, 55, 0.2)',
                                            letterSpacing: 1
                                        }} 
                                    />
                                    <Chip 
                                        label={`${profile?.tier?.toUpperCase() || 'BRONZE'} MEMBER`} 
                                        sx={{ 
                                            background: profile?.tier === 'Gold' ? 'linear-gradient(135deg, #D4AF37 0%, #F5E6A8 100%)' : (profile?.tier === 'Silver' ? '#C0C0C0' : '#cd7f32'), 
                                            color: profile?.tier === 'Gold' ? '#0B1020' : 'white', 
                                            fontWeight: '900',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                            letterSpacing: 1
                                        }} 
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Tabs Section */}
                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.05)', mb: 4 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 1, px: 3 },
                                '& .Mui-selected': { color: '#D4AF37 !important' },
                                '& .MuiTabs-indicator': { bgcolor: '#D4AF37', height: 3 }
                            }}
                        >
                            <Tab label="OVERVIEW" />
                            <Tab label="WISHLIST" />
                            <Tab label="ORDERS" />
                            <Tab label="QUEENS CLUB" />
                        </Tabs>
                    </Box>

                    {/* Content */}
                    <Box sx={{ minHeight: 400 }}>
                        {/* OVERVIEW TAB */}
                        {tabValue === 0 && (
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <MoneyIcon sx={{ fontSize: 48, color: '#D4AF37', mb: 2 }} />
                                            <Typography variant="h4" sx={{ mb: 1 }}>${orders.reduce((acc, curr) => acc + curr.total_amount, 0).toFixed(2)}</Typography>
                                            <Typography color="text.secondary">Total Luxury Spending</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <HistoryIcon sx={{ fontSize: 48, color: '#D4AF37', mb: 2 }} />
                                            <Typography variant="h4" sx={{ mb: 1 }}>{orders.length}</Typography>
                                            <Typography color="text.secondary">Total Orders</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <LoyaltyIcon sx={{ fontSize: 48, color: '#D4AF37', mb: 2 }} />
                                            <Typography variant="h4" sx={{ mb: 1 }}>{profile?.loyalty_points || 0}</Typography>
                                            <Typography color="text.secondary">Loyalty Points</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">Personal Information</Typography>
                                        <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}><Typography color="text.secondary">Full Name</Typography></Grid>
                                            <Grid item xs={8}><Typography fontWeight="medium">{profile?.username}</Typography></Grid>
                                            
                                            <Grid item xs={4}><Typography color="text.secondary">Email</Typography></Grid>
                                            <Grid item xs={8}><Typography fontWeight="medium">{profile?.email}</Typography></Grid>
                                            
                                            <Grid item xs={4}><Typography color="text.secondary">Phone</Typography></Grid>
                                            <Grid item xs={8}><Typography fontWeight="medium">+1 234 567 8900</Typography></Grid>
                                            
                                            <Grid item xs={4}><Typography color="text.secondary">Member Since</Typography></Grid>
                                            <Grid item xs={8}><Typography fontWeight="medium">{profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</Typography></Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">Account Stats</Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mt: 2 }}>
                                            <Box>
                                                <Typography variant="h4" color="primary" fontWeight="bold">{orders.length}</Typography>
                                                <Typography variant="body2" color="text.secondary">Orders</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" color="primary" fontWeight="bold">5</Typography>
                                                <Typography variant="body2" color="text.secondary">Reviews</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" color="primary" fontWeight="bold">0</Typography>
                                                <Typography variant="body2" color="text.secondary">Returns</Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {/* WISHLIST TAB */}
                        {tabValue === 1 && (
                            <Grid container spacing={3}>
                                {wishlist.length > 0 ? (
                                    wishlist.map((product) => (
                                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                                            <Card sx={{ display: 'flex', height: '100%' }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 120, objectFit: 'cover' }}
                                                    image={product.image_url || "https://source.unsplash.com/random?product"}
                                                    alt={product.name}
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                                        <Typography component="div" variant="h6" fontSize="1rem" fontWeight="bold">
                                                            {product.name}
                                                        </Typography>
                                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                                            ${product.price}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: 'space-between' }}>
                                                        <Button size="small">View</Button>
                                                        <IconButton color="error" onClick={() => removeFromWishlist(product.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Box sx={{ textAlign: 'center', py: 5 }}>
                                            <Typography color="text.secondary">Your wishlist is empty. Start exploring!</Typography>
                                            <Button variant="outlined" sx={{ mt: 2 }} href="/customer/explore">Go to Shop Explorer</Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {/* HISTORY TAB */}
                        {tabValue === 2 && (
                            <Box>
                                {orders.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {orders.map((order) => (
                                            <Grid item xs={12} key={order.id}>
                                                <Paper sx={{ p: 2, borderRadius: 2, borderLeft: '6px solid #1976d2' }}>
                                                    <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                                                        <Grid item xs={12} sm={3}>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                Order #{order.id}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} sm={3}>
                                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                Items: {order.item_count}
                                                            </Typography>
                                                            <Chip 
                                                                label={order.status} 
                                                                color={order.status === 'Completed' ? 'success' : 'warning'} 
                                                                size="small" 
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={3}>
                                                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                                ${order.total_amount.toFixed(2)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={3}>
                                                            {order.delivery_time && (
                                                                <Typography variant="caption" display="block" color="text.secondary">
                                                                    Delivery: {new Date(order.delivery_time).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">No recent orders</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Looks like you haven't bought anything yet. 
                                        </Typography>
                                        <Button variant="contained" href="/customer/explore">Start Shopping</Button>
                                    </Paper>
                                )}
                            </Box>
                        )}

                        {/* LOYALTY TAB */}
                        {tabValue === 3 && (
                            <Box>
                                <Grid container spacing={3}>
                                    {/* Points Stats */}
                                    <Grid item xs={12} md={8}>
                                        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>Tier Progress</Typography>
                                            <Box sx={{ mt: 4, mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {profile?.tier} Member
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {profile?.loyalty_points} / {profile?.tier === 'Bronze' ? '500' : (profile?.tier === 'Silver' ? '1500' : '∞')} Points
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={
                                                        profile?.tier === 'Bronze' 
                                                            ? (profile?.loyalty_points / 500) * 100 
                                                            : (profile?.tier === 'Silver' 
                                                                ? ((profile?.loyalty_points - 500) / 1000) * 100 
                                                                : 100)
                                                    } 
                                                    sx={{ height: 12, borderRadius: 5, bgcolor: '#eee' }}
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    {profile?.tier === 'Gold' 
                                                        ? "You've reached the highest tier! Enjoy your exclusive benefits." 
                                                        : `Earn ${profile?.tier === 'Bronze' ? 500 - profile?.loyalty_points : 1500 - profile?.loyalty_points} more points to reach ${profile?.tier === 'Bronze' ? 'Silver' : 'Gold'} tier.`
                                                    }
                                                </Typography>
                                            </Box>
                                            
                                            <Divider sx={{ my: 3 }} />
                                            
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>Tier Benefits</Typography>
                                            <Grid container spacing={2}>
                                                {[
                                                    { level: 'Bronze', perks: 'Standard Points, Base Offers', current: profile?.tier === 'Bronze' },
                                                    { level: 'Silver', perks: '1.2x Points, Preferred Delivery, Monthly Coupons', current: profile?.tier === 'Silver' },
                                                    { level: 'Gold', perks: '1.5x Points, VIP Support, Free Shipping, Event Early Access', current: profile?.tier === 'Gold' }
                                                ].map((benefit, i) => (
                                                    <Grid item xs={12} key={i}>
                                                        <Box sx={{ 
                                                            p: 2, 
                                                            borderRadius: 2, 
                                                            bgcolor: benefit.current ? 'primary.light' : 'transparent',
                                                            border: '1px solid',
                                                            borderColor: benefit.current ? 'primary.main' : '#eee',
                                                            color: benefit.current ? 'primary.contrastText' : 'inherit'
                                                        }}>
                                                            <Typography variant="subtitle1" fontWeight="bold">{benefit.level} Tier</Typography>
                                                            <Typography variant="body2">{benefit.perks}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    
                                    {/* Achievements/Badges */}
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 4, borderRadius: 3 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>Your Badges</Typography>
                                            <Box sx={{ mt: 2 }}>
                                                {[
                                                    { name: 'First Order', icon: <GiftIcon />, color: '#4caf50', active: orders.length > 0 },
                                                    { name: 'Fashionista', icon: <StarIcon />, color: '#9c27b0', active: false },
                                                    { name: 'Early Bird', icon: <OfferIcon />, color: '#ff9800', active: true },
                                                    { name: 'Big Spender', icon: <MoneyIcon />, color: '#d32f2f', active: profile?.loyalty_points > 1000 }
                                                ].map((badge, i) => (
                                                    <Box key={i} sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 2, 
                                                        mb: 2,
                                                        opacity: badge.active ? 1 : 0.3,
                                                        filter: badge.active ? 'none' : 'grayscale(1)'
                                                    }}>
                                                        <Avatar sx={{ bgcolor: badge.color }}>{badge.icon}</Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="bold">{badge.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {badge.active ? 'Unlocked' : 'Locked'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default CustomerProfile;
