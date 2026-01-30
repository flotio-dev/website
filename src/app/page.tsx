'use client';

import { Box, useTheme } from '@mui/material';
import { Navbar, Hero, Features, DocsCards, LandingFooter } from '@/components/landing';
import { colors } from '@/theme';

export default function Page() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <DocsCards />
      <Box sx={{ height: { xs: 60, md: 100 } }} />
      <Features />
      <Box sx={{ height: { xs: 80, md: 160 } }} />
      <LandingFooter />
    </Box>
  );
}
