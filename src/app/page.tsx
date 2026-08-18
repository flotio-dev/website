'use client';

import { Box, useTheme } from '@mui/material';
import { Navbar, Hero, Features, DocsCards, LandingFooter } from '@/components/landing';
import { colors } from '@/theme';

export default function Page() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Hero />
      <DocsCards />
      <Features />
      <LandingFooter />
    </Box>
  );
}
