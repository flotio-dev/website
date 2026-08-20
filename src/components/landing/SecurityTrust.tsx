'use client';

import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface SecurityItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const securityItems: SecurityItem[] = [
  {
    icon: <LockIcon sx={{ fontSize: 26, color: '#a855f7' }} />,
    title: 'AES-256 Secrets Encryption',
    description:
      'All uploaded Android Keystores, Play Store service account JSONs, and environment variables are strictly encrypted at rest and in transit.',
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 26, color: '#38bdf8' }} />,
    title: 'Single-Use Ephemeral Sandboxes',
    description:
      'Every compilation job runs inside a brand new, isolated Kubernetes container that is completely destroyed immediately upon build completion.',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 26, color: '#f59e0b' }} />,
    title: 'Pre-Warmed Fast Builds',
    description:
      'Intelligent caching layers for Flutter SDK versions and Gradle dependencies cut cold build times down to under 90 seconds on average.',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 26, color: '#10b981' }} />,
    title: 'Automated Play Store Track Delivery',
    description:
      'Directly promote your signed App Bundles to Internal Testing, Alpha, Beta, or Production tracks without touching Google Play Console manually.',
  },
];

export default function SecurityTrust() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 680, mx: 'auto' }}>
          <Typography
            sx={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#a855f7',
              mb: 1,
            }}
          >
            Security & Infrastructure
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.85rem', md: '2.5rem' },
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            Engineered for bulletproof reliability and privacy
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            Your proprietary source code and signing credentials never persist beyond your build lifetime.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {securityItems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    height: '100%',
                    borderRadius: '16px',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    gap: 2.5,
                    alignItems: 'flex-start',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-3px)',
                      boxShadow:
                        theme.palette.mode === 'light'
                          ? '0 8px 24px rgba(139,92,246,0.08)'
                          : '0 8px 24px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.75,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
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
}
