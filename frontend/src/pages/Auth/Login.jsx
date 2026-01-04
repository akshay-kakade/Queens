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
  CircularProgress
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      // Redirect based on role
      switch (result.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'tenant':
          navigate('/tenant');
          break;
        case 'customer':
        default:
          navigate('/customer');
          break;
      }
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
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={0} 
          className="glass-panel"
          sx={{ 
            p: 5, 
            width: '100%', 
            borderRadius: 6,
            background: 'rgba(11, 16, 32, 0.8)', // Deep Navy Glass
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
              sx={{ width: 140, mb: 4, filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))' }} 
            />
            
            <Typography component="h1" variant="h4" align="center" sx={{ mb: 1, letterSpacing: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4, fontWeight: 300 }}>
              Access your elite shopping dashboard
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, width: '100%', borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffbaba' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '&:hover fieldset': { borderColor: '#D4AF37' },
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '&:hover fieldset': { borderColor: '#D4AF37' },
                  }
                }}
              />
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
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link to="/register" style={{ textDecoration: 'none', color: '#D4AF37', fontWeight: '500', fontSize: '0.9rem' }}>
                  {"New here? Create an Account"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
