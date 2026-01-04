import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    shop_name: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'url("/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: 6
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper 
          elevation={0} 
          className="glass-panel"
          sx={{ 
            p: 5, 
            width: '100%', 
            borderRadius: 6,
            background: 'rgba(11, 16, 32, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Queens Logo" 
              sx={{ width: 120, mb: 3, filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))' }} 
            />
            
            <Typography component="h1" variant="h4" align="center" sx={{ mb: 1, letterSpacing: 1 }}>
              Registration
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4, fontWeight: 300 }}>
              Join the elite circle of Queens Shopping Mall
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, width: '100%', borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffbaba' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={formData.username}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    name="role"
                    label="I am a..."
                    value={formData.role}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                  >
                    <MenuItem value="customer">Customer (Shopper)</MenuItem>
                    <MenuItem value="tenant">Tenant (Shop Owner)</MenuItem>
                  </TextField>
                </Grid>

                {formData.role === 'tenant' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="shop_name"
                        label="Shop Name"
                        id="shop_name"
                        value={formData.shop_name}
                        onChange={handleChange}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="category"
                        label="Shop Category (e.g. Fashion, Food)"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 4, mb: 3, py: 1.8, 
                  fontSize: '1rem',
                  fontWeight: 'bold', 
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(212, 175, 55, 0.2)',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                  color: '#0B1020',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B8962E 0%, #D4AF37 100%)',
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#D4AF37', fontWeight: '500', fontSize: '0.9rem' }}>
                  {"Already a member? Log In"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
