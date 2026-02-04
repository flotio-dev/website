'use client';

import { Box, Paper, useTheme, TextField, FormControlLabel, Checkbox, Button, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { colors } from '@/theme';
import LoginHeader from './LoginHeader';

export default function LoginForm() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add login logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 5, sm: 6, md: 7 },
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isDark ? colors.background.dark.card : colors.background.light.card,
        backdropFilter: 'blur(12px)',
        width: '100%',
        maxWidth: '520px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <LoginHeader />

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
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
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
            autoComplete="current-password"
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
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 1,
                  },
                },
              },
            }}
          />

          {/* Remember me & Forgot password */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1,
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={<Typography sx={{ fontSize: '0.9rem' }}>Se souvenir de moi</Typography>}
            />
            <MuiLink
              component={Link}
              href="/auth/forgot-password"
              sx={{
                fontSize: '0.9rem',
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': { color: theme.palette.text.primary },
                textDecoration: 'none',
              }}
            >
              Mot de passe oublié ?
            </MuiLink>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
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
              '&:hover': {
                background: colors.primary.gradientHover,
                boxShadow: `0 6px 20px ${colors.primary.light}4d`,
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>

          {/* Sign up link */}
          <Typography variant="body2" textAlign="center" sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
            Pas encore de compte ?{' '}
            <MuiLink
              component={Link}
              href="/auth/register"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                '&:hover': { color: theme.palette.primary.main },
                textDecoration: 'none',
              }}
            >
              Créer un compte
            </MuiLink>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
