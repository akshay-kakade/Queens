import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, TextField, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid, Card, CardContent, 
    CardActions, IconButton, Toolbar, Container 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Event as EventIcon } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', date: '', image_url: '' });
    const [editingEvent, setEditingEvent] = useState(null);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events/');
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpen = (event = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                name: event.name,
                description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16),
                image_url: event.image_url
            });
        } else {
            setEditingEvent(null);
            setFormData({ name: '', description: '', date: '', image_url: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingEvent(null);
    };

    const handleSubmit = async () => {
        try {
            const eventData = { ...formData, date: new Date(formData.date).toISOString() };
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, eventData);
            } else {
                await api.post('/events/', eventData);
            }
            fetchEvents();
            handleClose();
        } catch (error) {
            console.error("Error saving event", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="admin" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h3">Event Management</Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpen()}
                        sx={{ px: 4 }}
                    >
                        Create New Event
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {events.map((event) => (
                        <Grid item key={event.id} xs={12} sm={6} md={4}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: 'var(--premium-shadow)',
                            }}>
                                <Box sx={{ 
                                    pt: '56.25%', 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    backgroundImage: `url(${event.image_url || "https://images.unsplash.com/photo-1540575861501-7ce0e220bed7?auto=format&fit=crop&q=80&w=800"})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }} />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h6" sx={{ color: '#D4AF37', mb: 1, fontWeight: 'bold' }}>
                                        {event.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 2, opacity: 0.6, letterSpacing: 1 }}>
                                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 300, lineHeight: 1.6 }}>
                                        {event.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                                    <Button size="small" variant="outlined" onClick={() => handleOpen(event)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                        Edit Details
                                    </Button>
                                    <IconButton color="error" onClick={() => handleDelete(event.id)} sx={{ bgcolor: 'rgba(211,47,47,0.05)', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog 
                    open={open} 
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            bgcolor: '#0F172A',
                            backgroundImage: 'none',
                            borderRadius: 4,
                            border: '1px solid rgba(212,175,55,0.2)',
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {editingEvent ? 'Modifier Event' : 'New Royal Event'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Event Name"
                            fullWidth
                            variant="filled"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                         <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Date"
                            type="datetime-local"
                            fullWidth
                            variant="filled"
                            InputLabelProps={{ shrink: true }}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                         <TextField
                            margin="dense"
                            label="Image URL"
                            fullWidth
                            variant="filled"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editingEvent ? 'Update Event' : 'Push Live'}
                        </Button>
                    </DialogActions>
                </Dialog>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminEvents;
