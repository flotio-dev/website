'use client';

import { Box, useTheme } from '@mui/material';
import { Navbar, LandingFooter } from '@/components/landing';
import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Background accents */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(${theme.palette.divider} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          opacity: 0.25,
          maskImage: 'radial-gradient(ellipse 60% 40% at 50% 20%, black 30%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          height: '60%',
          background: `radial-gradient(ellipse at center, ${theme.palette.primary.light}26 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, px: 2 }}>
        <RegisterForm />
      </Box>

      <LandingFooter />
    </Box>
  );
}
