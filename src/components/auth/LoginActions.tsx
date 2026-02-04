'use client';

import Link from 'next/link';
import {
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import { colors } from '@/theme';

interface LoginActionsProps {
  loading?: boolean;
}

export default function LoginActions({ loading = false }: LoginActionsProps) {
  const theme = useTheme();

  return (
    <>
      {/* Remember me & Forgot password */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <FormControlLabel control={<Checkbox />} label={<Typography sx={{ fontSize: '0.9rem' }}>Se souvenir de moi</Typography>} />
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
      </Stack>

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
    </>
  );
}
