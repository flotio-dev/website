'use client';
 
import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
const registerHref = appBaseUrl ? `${appBaseUrl}/auth/register` : '/';

export default function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Registration moved to the app.
      </Typography>
      <Button component={Link} href={registerHref} variant="contained" size="large">
        Go to App Register
      </Button>
    </Box>
  );
}
