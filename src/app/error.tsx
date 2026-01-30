'use client';

import { Container, Typography, Box, Button } from '@mui/material';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Une erreur est survenue
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Nous sommes désolés, quelque chose s'est mal passé.
        </Typography>

        <Button variant="contained" onClick={reset} size="large">
          Réessayer
        </Button>
      </Box>
    </Container>
  );
}
