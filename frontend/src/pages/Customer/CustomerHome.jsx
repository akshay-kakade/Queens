import {
    Box, Typography, Grid, Card, CardContent, CardActionArea, 
    Toolbar, IconButton, Badge, Tabs, Tab, CircularProgress,
    Container, Paper, Avatar, Divider, CardMedia, Button
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    Search as SearchIcon,
    Storefront as ShopIcon,
    Person as PersonIcon,
    Star as StarIcon,
    Event as EventIcon
   
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const CustomerHome = () => {
    const { user } = useAuth();
    const [shops, setShops] = useState([]);
    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Shops
                const shopsResponse = await api.get('/customer/shops');
                setShops(shopsResponse.data);

                // Fetch Events
                try {
                    const eventsResponse = await api.get('/events/');
                    setEvents(eventsResponse.data);
                } catch (e) {
                    console.error("Error loading events", e);
                }

                // Fetch Profile (Loyalty)
                try {
                    const profileResponse = await api.get('/customer/profile');
                    setProfile(profileResponse.data);
                } catch (e) {
                    console.error("Error loading profile", e);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleShopClick = async (shop) => {
        setSelectedShop(shop);
        try {
            const response = await api.get(`/customer/shops/${shop.id}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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
                
                {/* Header / Welcome Section */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                    <Box>
                         <Typography variant="h3" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                            Hello, {user?.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300, letterSpacing: 0.5 }}>
                            Welcome to the elite circle of <span style={{ color: '#D4AF37', fontWeight: 600 }}>Queens Mall</span>
                        </Typography>
                    </Box>
                    
                    {/* Membership Card - The Queens Club */}
                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        width: { xs: '100%', sm: 360 },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 6,
                        background: 'linear-gradient(135deg, #0F172A 0%, #0B1020 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.02)' }
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ letterSpacing: 3, color: '#D4AF37', fontSize: '0.9rem', mb: 0.5 }}>
                                        QUEENS CLUB
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6, letterSpacing: 1 }}>
                                        ELITE MEMBERSHIP
                                    </Typography>
                                </Box>
                                <Box 
                                    component="img" 
                                    src="/logo.png" 
                                    sx={{ height: 32, filter: 'brightness(0) invert(1) drop-shadow(0 0 5px rgba(212,175,55,0.5))' }} 
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {profile?.tier || 'BRONZE'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                        MEMBER SINCE {profile?.joined_at ? new Date(profile.joined_at).getFullYear() : '2026'}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                                        {profile?.loyalty_points || 0}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                        POINTS
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Decorative Gold Glow */}
                        <Box sx={{ 
                            position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%',
                            background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
                            zIndex: 0 
                        }} />
                    </Paper>
                </Box>

                {/* Navigation Tabs */}
                {selectedShop ? (
                    <Box sx={{ mb: 4 }}>
                         <Button 
                            startIcon={<span>&larr;</span>} 
                            onClick={() => setSelectedShop(null)}
                            sx={{ color: '#D4AF37', mb: 3 }}
                        >
                            Back to Dashboard
                        </Button>
                        <Paper className="glass-panel" sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 80, height: 80, 
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                        fontSize: '2rem', fontWeight: 'bold', color: '#0B1020'
                                    }}
                                >
                                    {selectedShop.shop_name[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h3">{selectedShop.shop_name}</Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>{selectedShop.category}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />
                            <Grid container spacing={4}>
                                {products.map((product) => (
                                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.05)', mb: 5 }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange} 
                                sx={{ 
                                    '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', py: 2 },
                                    '& .Mui-selected': { color: '#D4AF37 !important' },
                                    '& .MuiTabs-indicator': { bgcolor: '#D4AF37' }
                                }}
                            >
                                <Tab label="COLLECTIONS" />
                                <Tab label="ELITE SHOPS" />
                                <Tab label="PRIVATE EVENTS" />
                            </Tabs>
                        </Box>

                        {/* HOME TAB */}
                        {tabValue === 0 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h4">Featured Boutiques</Typography>
                                    <Button sx={{ color: '#D4AF37' }}>View All</Button>
                                </Box>
                                <Grid container spacing={3} sx={{ mb: 6 }}>
                                    {shops.slice(0, 4).map((shop) => (
                                        <Grid item key={shop.id} xs={12} sm={6} md={3}>
                                            <CardActionArea onClick={() => handleShopClick(shop)} sx={{ borderRadius: 4 }}>
                                                <Card sx={{ 
                                                    height: '100%', 
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    border: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <CardMedia
                                                            component="img"
                                                            height="300"
                                                            image={shop.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"}
                                                            alt={shop.shop_name}
                                                            sx={{ objectFit: 'cover', opacity: 0.8 }}
                                                        />
                                                        <Box sx={{ 
                                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                            background: 'linear-gradient(to bottom, transparent 0%, rgba(11,16,32,0.8) 100%)'
                                                        }} />
                                                    </Box>
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Typography variant="h6" noWrap sx={{ mb: 0.5 }}>{shop.shop_name}</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: 1 }}>{shop.category.toUpperCase()}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </CardActionArea>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Upcoming Events */}
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <EventIcon sx={{ mr: 1, color: 'secondary.main' }} /> Upcoming Events
                                </Typography>
                                <Grid container spacing={3}>
                                    {events.slice(0, 3).map((event) => (
                                        <Grid item key={event.id} xs={12} md={4}>
                                            <EventCard event={event} />
                                        </Grid>
                                    ))}
                                    {events.length === 0 && (
                                        <Grid item xs={12}>
                                            <Typography>No upcoming events.</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}

                        {/* SHOPS TAB */}
                        {tabValue === 1 && (
                            <Grid container spacing={3}>
                                {shops.map((shop) => (
                                    <Grid item key={shop.id} xs={12} sm={6} md={4}>
                                        <Card elevation={2} sx={{ 
                                            transition: 'transform 0.2s', 
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } 
                                        }}>
                                            <CardActionArea onClick={() => handleShopClick(shop)}>
                                                {shop.image_url ? (
                                                    <CardMedia
                                                        component="img"
                                                        height="340"
                                                        image={shop.image_url}
                                                        alt={shop.shop_name}
                                                        sx={{ objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                 <Box sx={{ 
                                                    display: shop.image_url ? 'none' : 'flex', 
                                                    alignItems: 'center', justifyContent: 'center', 
                                                    height: 340, bgcolor: 'grey.100', color: 'grey.500'
                                                }}>
                                                    <ShopIcon sx={{ fontSize: 60 }} />
                                                </Box>
                                                <CardContent sx={{ textAlign: 'center' }}>
                                                    <Typography gutterBottom variant="h6" fontWeight="bold">
                                                        {shop.shop_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {shop.category || 'General Store'}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        
                         {/* EVENTS TAB */}
                         {tabValue === 2 && (
                            <Grid container spacing={3}>
                                {events.map((event) => (
                                    <Grid item key={event.id} xs={12} md={4}>
                                        <EventCard event={event} />
                                    </Grid>
                                ))}
                            </Grid>
                         )}
                    </>
                )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default CustomerHome;
