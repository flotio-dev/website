'use client';

import { Box, useTheme } from '@mui/material';
import { Navbar, LandingFooter } from '@/components/landing';
import { useAuthForm } from '@/hooks/useAuthForm';
import { AuthForm } from '@/components/auth';

export default function LoginPage() {
  const theme = useTheme();
  const { formData, loading, handleChange, handleSubmit } = useAuthForm('login');

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
        <AuthForm
          mode="login"
          loading={loading}
          email={formData.email}
          password={formData.password}
          onEmailChange={(value) => handleChange('email', value)}
          onPasswordChange={(value) => handleChange('password', value)}
          onSubmit={handleSubmit}
        />
      </Box>

      <LandingFooter />
    </Box>
  );
}
