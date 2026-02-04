'use client';

import { TextField, useTheme } from '@mui/material';
import { colors } from '@/theme';

interface LoginFieldsProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export default function LoginFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LoginFieldsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <TextField
        label="Adresse e-mail"
        type="email"
        fullWidth
        autoComplete="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: isDark ? colors.background.dark.paper : colors.background.light.paper,
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
          },
        }}
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        autoComplete="current-password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: isDark ? colors.background.dark.paper : colors.background.light.paper,
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
          },
        }}
      />
    </>
  );
}
