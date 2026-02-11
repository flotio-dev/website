'use client';

import Link from 'next/link';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import { AuthMode } from '@/hooks/useAuthForm';

interface AuthFormProps {
  mode: AuthMode;
  loading: boolean;
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  onEmailChange: (value: string) => void;
  onUsernameChange?: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

export default function AuthForm({
  mode,
  loading,
  email,
  username,
  password,
  confirmPassword,
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  error,
}: AuthFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const config = {
    title: t(`auth.${mode}.title`),
    subtitle: t(`auth.${mode}.subtitle`),
    buttonText: t(`auth.${mode}.buttonText`),
    buttonLoadingText: t(`auth.${mode}.buttonLoadingText`),
    linkText: t(`auth.${mode}.linkText`),
    linkLabel: t(`auth.${mode}.linkLabel`),
    linkHref: mode === 'login' ? '/auth/register' : '/auth/login',
  };

  const textFieldProps = {
    fullWidth: true,
    variant: 'outlined' as const,
    InputProps: {
      sx: {
        height: '50px',
        borderRadius: '12px',
        bgcolor: isDark
          ? colors.background.dark.paper
          : colors.background.light.paper,
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
          textAlign: 'left' as const,
          textIndent: '12px',
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 1,
          },
        },
      },
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isDark
          ? colors.background.dark.card
          : colors.background.light.card,
        backdropFilter: 'blur(12px)',
        width: '100%',
        maxWidth: '520px',
      }}
    >
      <form onSubmit={onSubmit}>
        <Box
          className="login-form-content"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Header */}
          <Box textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: '2rem', sm: '2.2rem' },
                mb: 1,
              }}
            >
              {config.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.95rem',
              }}
            >
              {config.subtitle}
            </Typography>
          </Box>

          {/* Email Field */}
          <TextField
            {...textFieldProps}
            placeholder={t('auth.email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />

          {/* Username Field */}
          {mode === 'register' && onUsernameChange && (
            <TextField
              {...textFieldProps}
              placeholder={t('auth.username')}
              type="text"
              autoComplete="username"
              value={username || ''}
              onChange={(e) => onUsernameChange(e.target.value)}
            />
          )}


          {/* Password Field */}
          <TextField
            {...textFieldProps}
            placeholder={t('auth.password')}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <TextField
              {...textFieldProps}
              placeholder={t('auth.confirmPassword')}
              type="password"
              autoComplete="new-password"
              value={confirmPassword || ''}
              onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            />
          )}

          {error && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.main,
                fontSize: '0.9rem',
                textAlign: 'center',
                mt: 1,
                mb: 1,
              }}
            >
              {error}
            </Typography>
          )}

          {/* Submit Button */}
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
            {loading ? config.buttonLoadingText : config.buttonText}
          </Button>

          {/* Auth Link */}
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}
          >
            {config.linkText}
            <MuiLink
              component={Link}
              href={config.linkHref}
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
              {config.linkLabel}
            </MuiLink>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
