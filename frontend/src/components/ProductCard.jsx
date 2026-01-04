import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Box, Snackbar, Alert } from '@mui/material';
import { AddShoppingCart as AddIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [toastOpen, setToastOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setToastOpen(true);
  };

  return (
    <>
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'var(--premium-shadow)',
        }}>
        <CardMedia
            component="div"
            sx={{
                pt: '100%', // 1:1 ratio for premium products
                bgcolor: 'rgba(255,255,255,0.02)',
            }}
            image={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography gutterBottom variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 2,
                fontWeight: 300
            }}>
                {product.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                    ${product.price}
                </Typography>
                {product.stock < 10 && (
                    <Chip 
                        label={product.stock === 0 ? "Out of Stock" : `Only ${product.stock} Left`} 
                        size="small" 
                        sx={{ 
                            bgcolor: product.stock === 0 ? 'rgba(211,47,47,0.1)' : 'rgba(212,175,55,0.1)', 
                            color: product.stock === 0 ? '#ff5252' : '#D4AF37',
                            border: '1px solid currentColor',
                            fontSize: '0.65rem',
                            fontWeight: 'bold'
                        }} 
                    />
                )}
            </Box>
        </CardContent>
        <CardActions sx={{ p: 1.5, pt: 0 }}>
            <Button 
                variant="contained" 
                fullWidth 
                startIcon={<AddIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ borderRadius: 2 }}
            >
                {product.stock === 0 ? 'Out of Stock' : 'Reserve Now'}
            </Button>
        </CardActions>
        </Card>
        
        <Snackbar 
            open={toastOpen} 
            autoHideDuration={2000} 
            onClose={() => setToastOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
                Added to cart!
            </Alert>
        </Snackbar>
    </>
  );
};

export default ProductCard;
