import React, { useState } from 'react';
import { 
    Card, CardContent, CardMedia, Typography, Box, 
    Button, Chip, Divider, Snackbar, Alert 
} from '@mui/material';
import { 
    Event as EventIcon, 
    AccessTime as TimeIcon, 
    Star as StarIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const EventCard = ({ event, role = 'customer' }) => {
    const [rsvp, setRsvp] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleRSVP = () => {
        setRsvp(!rsvp);
        if (!rsvp) setShowToast(true);
    };

    return (
        <>
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
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 'var(--premium-shadow)',
                        borderColor: 'rgba(212, 175, 55, 0.3)'
                    }
                }}
            >
                {/* Image Section */}
                <Box sx={{ position: 'relative', pt: '60%' }}>
                    <CardMedia
                        component="img"
                        image={event.image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
                        alt={event.name}
                        sx={{ 
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(11,16,32,0.9) 100%)'
                    }} />
                    
                    <Chip 
                        label="EXCLUSIVE" 
                        size="small"
                        icon={<StarIcon sx={{ fontSize: '12px !important' }} />}
                        sx={{ 
                            position: 'absolute', top: 16, right: 16,
                            bgcolor: 'rgba(212, 175, 55, 0.9)', color: '#0B1020',
                            fontWeight: 'bold', fontSize: '0.65rem', letterSpacing: 1
                        }} 
                    />
                </Box>

                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                        {event.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.8 }}>
                        <TimeIcon sx={{ fontSize: 16, color: '#D4AF37' }} />
                        <Typography variant="caption" sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                            {new Date(event.date).toLocaleDateString(undefined, { 
                                month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                        </Typography>
                    </Box>

                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mb: 3, flexGrow: 1,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            overflow: 'hidden', lineHeight: 1.6
                        }}
                    >
                        {event.description}
                    </Typography>

                    <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                    
                    {role === 'customer' && (
                        <Button
                            fullWidth
                            variant={rsvp ? "outlined" : "contained"}
                            onClick={handleRSVP}
                            startIcon={rsvp ? <CheckCircleIcon /> : null}
                            sx={{
                                py: 1.2,
                                borderRadius: 2,
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                fontSize: '0.75rem',
                                border: rsvp ? '1px solid #D4AF37' : 'none',
                                color: rsvp ? '#D4AF37' : '#0B1020',
                                background: rsvp ? 'transparent' : 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                                '&:hover': {
                                    background: rsvp ? 'rgba(212, 175, 55, 0.1)' : 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)',
                                    borderColor: '#D4AF37'
                                }
                            }}
                        >
                            {rsvp ? 'RESERVED' : 'RESERVE YOUR SEAT'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Snackbar 
                open={showToast} 
                autoHideDuration={4000} 
                onClose={() => setShowToast(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setShowToast(false)} 
                    severity="success" 
                    sx={{ 
                        width: '100%', 
                        bgcolor: '#0B1020', 
                        color: '#D4AF37',
                        border: '1px solid #D4AF37',
                        '& .MuiAlert-icon': { color: '#D4AF37' }
                    }}
                >
                    <Typography sx={{ fontWeight: 'bold' }}>INVITATION ACCEPTED</Typography>
                    <Typography variant="body2">We look forward to seeing you at {event.name}.</Typography>
                </Alert>
            </Snackbar>
        </>
    );
};

export default EventCard;
