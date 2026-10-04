import { Poppins } from 'next/font/google';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

// Self-hosted by next/font: no render-blocking request to Google Fonts.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Keep in sync with the CSS variables in src/styles/globals.css
const ink = '#222222';
const teal = '#0a7d84';
const tealBright = '#33cccc';

/**
 * Light + dark palettes as CSS variables. CssVarsProvider (src/pages/_app.tsx) switches them
 * with the `data-mui-color-scheme` attribute on <html>, which globals.css also keys off.
 */
export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: teal, dark: '#075f65', light: tealBright, contrastText: '#ffffff' },
        secondary: { main: '#5D6363', contrastText: '#ffffff' },
        text: { primary: ink, secondary: '#5D6363' },
        background: { default: '#ffffff', paper: '#ffffff' },
        divider: '#e3e8e8',
      },
    },
    dark: {
      palette: {
        primary: { main: tealBright, dark: teal, light: '#7fe0e0', contrastText: '#0b1214' },
        secondary: { main: '#b3b2ae', contrastText: '#15181b' },
        text: { primary: '#e8ecec', secondary: '#a9b1b1' },
        background: { default: '#0f1214', paper: '#171b1e' },
        divider: 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `${poppins.style.fontFamily}, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
    h1: { fontSize: 'clamp(1.9rem, 1.2rem + 3vw, 3.25rem)', fontWeight: 700, lineHeight: 1.15 },
    h2: { fontSize: 'clamp(1.6rem, 1.2rem + 1.6vw, 2.4rem)', fontWeight: 700, lineHeight: 1.2 },
    h3: { fontSize: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1.0625rem', fontWeight: 600 },
    subtitle2: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      defaultProps: { variant: 'contained', disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 44,
          transition: 'background-color .2s, color .2s, transform .2s, box-shadow .2s',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        sizeSmall: { minHeight: 36, paddingInline: 14 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid var(--mui-palette-divider)', borderRadius: 16 },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '3px solid var(--mui-palette-primary-main)',
            outlineOffset: 2,
          },
        },
      },
    },
  },
});
