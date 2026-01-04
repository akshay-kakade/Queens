import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Toolbar, Grid, Container
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', description: '', image_url: '' });

    const fetchProducts = async () => {
        try {
            const response = await api.get('/tenant/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        
        // Also fetch tenant status to check approval
        const checkApproval = async () => {
            try {
                const res = await api.get('/tenant/stats');
                setIsApproved(res.data.is_approved);
            } catch (error) {
                console.error("Failed to check approval", error);
            }
        };
        checkApproval();
    }, []);

    const [isApproved, setIsApproved] = useState(true); // Default to true to avoid flicker

    const handleOpen = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({ 
                name: product.name, 
                price: product.price, 
                stock: product.stock, 
                description: product.description,
                image_url: product.image_url || ''
            });
        } else {
            setCurrentProduct(null);
            setFormData({ name: '', price: '', stock: '', description: '', image_url: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            if (currentProduct) {
                await api.put(`/tenant/products/${currentProduct.id}`, formData);
            } else {
                await api.post('/tenant/products', formData);
            }
            fetchProducts();
            handleClose();
        } catch (error) {
            console.error("Error saving product", error);
            const message = error.response?.data?.message || "Failed to save product. Please check your inputs.";
            alert(message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/tenant/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="tenant" />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h3" sx={{ mb: 1 }}>Inventory Management</Typography>
                        {!isApproved && (
                            <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold', letterSpacing: 1 }}>
                                * DEPOSIT OF NEW ITEMS DISABLED UNTIL ROYAL APPROVAL
                            </Typography>
                        )}
                    </Box>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpen()}
                        disabled={!isApproved}
                        sx={{ 
                            height: 'fit-content',
                            py: 1.5, px: 3,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                            color: '#0B1020',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)',
                            }
                        }}
                    >
                        ADD TO COLLECTION
                    </Button>
                </Box>

                <TableContainer 
                    component={Paper} 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        bgcolor: 'background.paper',
                        boxShadow: 'var(--premium-shadow)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>ITEM NAME</TableCell>
                                <TableCell sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>DESCRIPTION</TableCell>
                                <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>PRICE</TableCell>
                                <TableCell align="right" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>STOCK</TableCell>
                                <TableCell align="center" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                    <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 300 }}>{product.description}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#D4AF37' }}>${product.price}</TableCell>
                                    <TableCell align="right">{product.stock}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleOpen(product)} sx={{ color: '#D4AF37' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(product.id)} sx={{ color: '#d32f2f', opacity: 0.7 }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No items in your collection yet. Start adding!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog 
                    open={open} 
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            bgcolor: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: 4,
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: 1 }}>
                        {currentProduct ? 'REFINE ITEM' : 'NEW COLLECTION PIECE'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    label="ITEM NAME"
                                    fullWidth
                                    variant="filled"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="DESCRIPTION"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="filled"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="PRICE ($)"
                                    type="number"
                                    fullWidth
                                    variant="filled"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="STOCK"
                                    type="number"
                                    fullWidth
                                    variant="filled"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="IMAGE URL"
                                    fullWidth
                                    variant="filled"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    helperText="Provide a direct link to the product's visual showcase."
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>CANCEL</Button>
                        <Button 
                            onClick={handleSubmit} 
                            variant="contained"
                            sx={{ 
                                bgcolor: '#D4AF37', 
                                color: '#0B1020', 
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#B8962E' }
                            }}
                        >
                            {currentProduct ? 'SAVE REFINEMENT' : 'ADD TO COLLECTION'}
                        </Button>
                    </DialogActions>
                </Dialog>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Inventory;
