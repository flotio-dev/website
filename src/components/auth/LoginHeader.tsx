'use client';

import { Stack, Typography, useTheme } from '@mui/material';

export default function LoginHeader() {
  const theme = useTheme();

  return (
    <Stack spacing={2} textAlign="center">
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          fontSize: { xs: '2rem', sm: '2.2rem' },
        }}
      >
        Connexion
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '0.95rem',
        }}
      >
        Accédez à votre espace Flotio
      </Typography>
    </Stack>
  );
}
