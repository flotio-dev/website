'use client';

import { Box, Paper, useTheme, TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { colors } from '@/theme';
import RegisterHeader from '@/components/auth/RegisterHeader';

export default function RegisterForm() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add register logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isDark ? colors.background.dark.card : colors.background.light.card,
        backdropFilter: 'blur(12px)',
        width: '100%',
        maxWidth: '520px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box className="login-form-content" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header */}
          <RegisterHeader />

          {/* Email Field */}
          <TextField
            placeholder="Adresse e-mail"
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                height: '50px',
                borderRadius: '12px',
                bgcolor: isDark ? colors.background.dark.paper : colors.background.light.paper,
                display: 'flex',
                alignItems: 'center',
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '& input': {
                  padding: 0,
                  paddingLeft: '28px',
                  paddingRight: '16px',
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
                  textAlign: 'left',
                  textIndent: '12px',
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 1,
                  },
                },
              },
            }}
          />

          {/* Password Field */}
          <TextField
            placeholder="Mot de passe"
            type="password"
            fullWidth
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                height: '50px',
                borderRadius: '12px',
                bgcolor: isDark ? colors.background.dark.paper : colors.background.light.paper,
                display: 'flex',
                alignItems: 'center',
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '& input': {
                  padding: 0,
                  paddingLeft: '28px',
                  paddingRight: '16px',
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
                  textAlign: 'left',
                  textIndent: '12px',
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 1,
                  },
                },
              },
            }}
          />

          {/* Confirm Password Field */}
          <TextField
            placeholder="Confirmer le mot de passe"
            type="password"
            fullWidth
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                height: '50px',
                borderRadius: '12px',
                bgcolor: isDark ? colors.background.dark.paper : colors.background.light.paper,
                display: 'flex',
                alignItems: 'center',
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '& input': {
                  padding: 0,
                  paddingLeft: '28px',
                  paddingRight: '16px',
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
                  textAlign: 'left',
                  textIndent: '12px',
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 1,
                  },
                },
              },
            }}
          />

          {/* Register Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: '12px',
              py: 1.75,
              fontWeight: 600,
              fontSize: '1rem',
              background: colors.primary.gradient,
              color: theme.palette.text.primary,
              boxShadow: 'none',
              textTransform: 'none',
              width: '200px',
              alignSelf: 'center',
              '&:hover': {
                background: colors.primary.gradientHover,
                boxShadow: `0 6px 20px ${colors.primary.light}4d`,
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? 'Création en cours...' : "S'inscrire"}
          </Button>

          {/* Sign in link */}
          <Typography variant="body2" textAlign="center" sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
            Vous avez déjà un compte ?{' '}
            <MuiLink
              component={Link}
              href="/auth/login"
              sx={{
                fontWeight: 600,
                color: colors.primary.light,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: colors.primary.main,
                },
                textDecoration: 'none',
              }}
            >
              Se connecter
            </MuiLink>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
