import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#D5DBDB',
    },
    secondary: {
      main: '#B3B2AE',
    },
    info: {
      main: '#222222',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#222222',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600,
        },
        h2: {
          fontSize: 20,
          fontWeight: 400,
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
        },
        subtitle2: {
          fontSize: 20,
          fontWeight: 600,
        },
        root: {
          color: '#222222',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'small',
        disableElevation: true,
        color: 'info',
      },
      styleOverrides: {
        root: {
          fontSize: '16px',
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 10,
          ':hover': {
            color: '#222222',
            backgroundColor: '#D5DBDB',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
