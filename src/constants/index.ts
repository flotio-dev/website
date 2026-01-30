// App constants

export const APP_NAME = 'Mon App';
export const APP_DESCRIPTION = 'Application Next.js avec MUI et i18n';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

// Breakpoints (matching MUI)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LOCALE: 'locale',
} as const;
