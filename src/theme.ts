'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          text: {
            primary: '#111111',
            secondary: '#444444',
          },
          background: {
            default: '#f9fafb',
            paper: '#ffffff',
          },
        }
      : {
          text: {
            primary: '#ffffff',
            secondary: '#bbbbbb',
          },
          background: {
            default: '#0d1117',
            paper: '#161b22',
          },
        }),
  },

  // GLOBAL OVERRIDES FOR TEXTFIELD
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },
  },
});

const theme = createTheme(baseTheme('light'));
export default theme;
