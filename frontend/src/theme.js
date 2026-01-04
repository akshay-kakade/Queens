import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Switching to dark for luxury feel
    primary: {
      main: '#D4AF37', // Metallic Gold
      light: '#F5E6A8',
      dark: '#B8962E',
      contrastText: '#0B1020',
    },
    secondary: {
      main: '#0F172A', // Deep Navy
    },
    background: {
      default: '#0B1020', // Near-black navy
      paper: '#0F172A',   // Navy panel
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B8C1',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Inter", sans-serif',
    fontSize: 13, // Global reduction from 14
    h1: { fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: '2.5rem', letterSpacing: '2px' },
    h2: { fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: '2rem', letterSpacing: '1.5px' },
    h3: { fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: '1.1rem' },
    h6: { fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: '0.9rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 8, // More compact radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '6px 16px', // Compact padding
          fontSize: '0.875rem',
          transition: 'all 0.25s ease-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
          color: '#0B1020',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Compact radius
          backgroundColor: '#0F172A',
          transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
        }
      }
    }
  },
});

export default theme;
