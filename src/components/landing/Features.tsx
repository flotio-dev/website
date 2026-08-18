'use client';

import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TerminalIcon from '@mui/icons-material/Terminal';
import SpeedIcon from '@mui/icons-material/Speed';

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: 'Dedicated Cloud Build Runners',
    description: 'High-speed Linux and Apple Silicon M2 runners configured specifically for Flutter & Dart workflows. No environment setup needed.',
  },
  {
    title: 'Automated Code Signing',
    description: 'Effortlessly manage Android Keystores and Apple Provisioning Profiles. Encrypted secrets injected securely at build time.',
  },
  {
    title: 'Flotio CLI & Git Webhooks',
    description: 'Trigger and monitor builds directly from your local terminal with the Flotio CLI or automatically on Git push.',
  },
  {
    title: 'Instant Logs & Artifacts Delivery',
    description: 'Stream build logs in real-time. Download production-ready APK, AAB, and IPA packages instantly upon completion.',
  },
];

const Features = () => {
  const theme = useTheme();
  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.background.default,
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, maxWidth: 640, mx: 'auto' }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            Built for modern Flutter teams
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            Everything you need to compile, test, sign, and distribute mobile applications without maintaining local infrastructure.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2.5,
                    alignItems: 'flex-start',
                    p: { xs: 3, sm: 3.5 },
                    height: '100%',
                    borderRadius: '16px',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 2px 12px 0 rgba(124,58,237,0.04), 0 1.5px 4px 0 rgba(0,0,0,0.02)'
                      : '0 2px 12px 0 rgba(0,0,0,0.1)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 8px 24px rgba(139,92,246,0.1)'
                        : '0 8px 24px rgba(0,0,0,0.25)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                      border: `1px solid rgba(139, 92, 246, 0.25)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {index === 0 && <CloudQueueIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />}
                    {index === 1 && <VpnKeyIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />}
                    {index === 2 && <TerminalIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />}
                    {index === 3 && <SpeedIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '1.05rem',
                        mb: 0.75,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;

