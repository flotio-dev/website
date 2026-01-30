'use client';

import { Box, useTheme } from '@mui/material';
import { Navbar, LandingFooter} from '@/components/landing';
import { LanguageSelector, ThemeSwitcher } from '@/components/preferences';
import { colors } from '@/theme';

export default function PreferencesPage() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <LanguageSelector />
      <ThemeSwitcher />
      <LandingFooter />
    </Box>
  );
}
