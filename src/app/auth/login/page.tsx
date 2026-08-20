'use client';
 
import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
const loginHref = appBaseUrl ? `${appBaseUrl}/auth/login` : '/';

export default function LoginPage() {
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
        Login moved to the app.
      </Typography>
      <Button component={Link} href={loginHref} variant="contained" size="large">
        Go to App Login
      </Button>
    </Box>
  );
}
