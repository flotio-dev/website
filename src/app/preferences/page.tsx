'use client';

import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { Navbar, LandingFooter } from '@/components/landing';
import { LanguageSelector, ThemeSwitcher } from '@/components/preferences';
import TuneIcon from '@mui/icons-material/Tune';

export default function PreferencesPage() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ pt: { xs: 14, md: 16 }, pb: 12, flex: 1 }}>
        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: '100px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#8b5cf6',
              fontSize: '0.8rem',
              fontWeight: 600,
              mb: 2,
            }}
          >
            <TuneIcon sx={{ fontSize: 16 }} />
            <span>Paramètres de l'application</span>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            Préférences
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            Personnalisez votre environnement de travail, la langue et le thème d'affichage.
          </Typography>
        </Box>

        <Stack spacing={4}>
          <LanguageSelector />
          <ThemeSwitcher />
        </Stack>
      </Container>

      <LandingFooter />
    </Box>
  );
}
