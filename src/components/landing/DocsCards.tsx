'use client';

import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import TerminalIcon from '@mui/icons-material/Terminal';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '@/theme';

interface DocCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const docCards: DocCard[] = [
  {
    icon: <TerminalIcon sx={{ fontSize: 26 }} />,
    title: 'Quickstart Guide',
    description:
      'Learn how to deploy your first application with the Veloce CLI or directly from your Git repository in under 5 minutes.',
    linkText: 'Read guide',
  },
  {
    icon: <WidgetsIcon sx={{ fontSize: 26 }} />,
    title: 'Frameworks',
    description:
      'Optimized builds for Next.js, React, Vue, Svelte, and more. Zero configuration required for most popular frameworks.',
    linkText: 'View frameworks',
  },
  {
    icon: <TuneIcon sx={{ fontSize: 26 }} />,
    title: 'Configuration',
    description:
      'Deep dive into environment variables, build settings, custom domains, and edge network configuration.',
    linkText: 'Configure now',
  },
];

export default function DocsCards() {
  const theme = useTheme();
  return (
    <Box
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Section Header */}
        <Box sx={{ mb: { xs: 6, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, width: '85%' }}>
          <Box sx={{ maxWidth: 500 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: theme.palette.text.primary,
                letterSpacing: '-0.02em',
                mb: '12px!important',
              }}
            >
              Everything you need to ship
            </Typography>
            <Box sx={{ mb: '4px!important' }} /> {}
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1rem',
                lineHeight: 1.7,
                mb: '20px!important',
              }}
            >
              Explore our documentation to get up and running in minutes, not days.
            </Typography>
            {/* Ajoute un espace supplémentaire sous le texte de description */}
            <Box sx={{ mb: { xs: '4!important', md: '6!important' } }} />
          </Box>
          <Box
            component="a"
            href="/docs"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: colors.primary.main,
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
              mt: { xs: 0, md: 1 },
              '&:hover': {
                color: colors.primary.light,
              },
            }}
          >
            <span style={{ color: colors.primary.main }}>View all docs</span>
            <ArrowForwardIcon sx={{ fontSize: 16, color: colors.primary.main }} />
          </Box>
        </Box>

        {/* Cards Grid */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            width: '85%',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            minWidth: 0,
          }}
          columns={12}
        >
          {docCards.map((card, index) => (
            <Grid
              size={{ xs: 4, md: 4 }}
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
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
                  sx={{
                    p: { xs: '40px!important', md: '48px!important' },
                    mb: { xs: '16px!important', md: '24px!important' },
                    minHeight: { xs: '260px!important', md: '270px!important' },
                    height: '100%',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'light' ? colors.border.light.default : theme.palette.divider}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    minWidth: 0,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 2px 12px 0 rgba(124,58,237,0.06), 0 1.5px 4px 0 rgba(0,0,0,0.03)'
                      : '0 2px 12px 0 rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                      borderColor: theme.palette.mode === 'light'
                        ? colors.border.light.hover
                        : theme.palette.divider,
                    },
                  }}
                >
                  <Stack spacing={'16px!important'} height="100%">
                    {/* Icon */}
                    <Box
                      sx={{
                        width: '48px!important',
                        height: '48px!important',
                        borderRadius: '12px!important',
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: '-18px!important',
                        mb: '0!important',
                        p: 0,
                      }}
                    >
                      {card.icon}
                    </Box>
                    {/* Content */}
                    <Box sx={{ flex: 1, mb: '0!important' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: '1.1rem',
                          mb: '2px!important',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
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
                        gap: '8px!important',
                        color: colors.primary.main,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: colors.primary.light,
                        },
                        mt: 'auto',
                      }}
                    >
                      {card.linkText}
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
