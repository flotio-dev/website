'use client';

import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function NotFound() {
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
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 700 }}>
            404
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom>
            Page non trouvée
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </Typography>

          <Button variant="contained" component={Link} href="/" size="large">
            Retour à l'accueil
          </Button>
        </MotionBox>
      </Box>
    </Container>
  );
}
