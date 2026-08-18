'use client';

import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '@/theme';

interface DocCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

const docCards: DocCard[] = [
  {
    icon: <PlayCircleOutlineIcon sx={{ fontSize: 26, color: '#8b5cf6' }} />,
    title: 'Quickstart Guide',
    description:
      'Connect your Flutter repository and trigger your first automated cloud build in under 5 minutes.',
    linkText: 'Read guide',
    href: '/docs/quickstart',
  },
  {
    icon: <SettingsSuggestIcon sx={{ fontSize: 26, color: '#38bdf8' }} />,
    title: 'Flutter Configuration',
    description:
      'Configure Android Keystores, iOS Provisioning Profiles, Flutter SDK channels, and Dart environment defines.',
    linkText: 'View configuration',
    href: '/docs/flutter-configuration',
  },
  {
    icon: <TerminalIcon sx={{ fontSize: 26, color: '#10b981' }} />,
    title: 'Flotio CLI Reference',
    description:
      'Run builds, stream live compilation logs, manage secrets, and download release APK/IPAs directly from your terminal.',
    linkText: 'Explore CLI',
    href: '/docs/cli',
  },
];

export default function DocsCards() {
  const theme = useTheme();
  return (
    <Box
      sx={{ 
        py: { xs: 8, md: 10 }, 
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ mb: { xs: 5, md: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ maxWidth: 540 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: theme.palette.text.primary,
                letterSpacing: '-0.02em',
                mb: 1.5,
              }}
            >
              Everything you need to ship
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              Explore our technical documentation and step-by-step guides to master your Flutter mobile delivery pipeline.
            </Typography>
          </Box>
          <Box
            component={Link}
            href="/docs"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: colors.primary.main,
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
              pb: 0.5,
              '&:hover': {
                color: colors.primary.light,
              },
            }}
          >
            <span>View all docs</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>

        {/* Cards Grid */}
        <Grid
          container
          spacing={3}
        >
          {docCards.map((card, index) => (
            <Grid
              size={{ xs: 12, md: 4 }}
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{ flex: 1, display: 'flex' }}
              >
                <Paper
                  component={Link}
                  href={card.href}
                  sx={{
                    p: { xs: 3.5, md: 4 },
                    minHeight: { xs: 220, md: 240 },
                    height: '100%',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 2px 12px 0 rgba(124,58,237,0.06), 0 1.5px 4px 0 rgba(0,0,0,0.03)'
                      : '0 2px 12px 0 rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 8px 24px rgba(139,92,246,0.12)'
                        : '0 8px 24px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Stack spacing={2} height="100%">
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: '1.05rem',
                          mb: 1,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>

                    {/* Link */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        color: colors.primary.main,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        mt: 'auto',
                        pt: 1,
                      }}
                    >
                      <span>{card.linkText}</span>
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

