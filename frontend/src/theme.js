// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
        },
        root: {
          borderRadius: 'var(--border-radius-lg)', // Added border radius
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }
          }
        }
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)', // Added border radius
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--border-radius-lg)', // Added border radius to outline
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(29, 86, 172, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 300,
        },
      },
    },
  },
});

export default theme;
