'use client';

import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import MemoryIcon from '@mui/icons-material/Memory';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Connect & Configure',
    subtitle: 'Zero complex setup',
    description:
      'Link your GitHub repository in 1 click. Flotio automatically detects your Flutter SDK version, Gradle wrapper, and build targets.',
    icon: <GitHubIcon sx={{ fontSize: 28, color: '#38bdf8' }} />,
    tags: ['GitHub Webhooks', 'Auto SDK Detection', 'Flutter 3.19 - 3.29'],
  },
  {
    number: '02',
    title: 'Compile & Stream Logs',
    subtitle: 'High-speed cloud runners',
    description:
      'Every commit triggers an isolated, ephemeral build container. Watch real-time logs with ANSI color formatting and stage breakdown.',
    icon: <MemoryIcon sx={{ fontSize: 28, color: '#8b5cf6' }} />,
    tags: ['Ephemeral Pods', 'Pre-warmed Cache', 'Live ANSI Streaming'],
  },
  {
    number: '03',
    title: 'Sign & Distribute',
    subtitle: 'Production-ready binaries',
    description:
      'Inject AES-256 encrypted Android Keystores and Google Play service keys to produce signed APKs/AABs ready for direct release.',
    icon: <SendIcon sx={{ fontSize: 28, color: '#10b981' }} />,
    tags: ['Automated Signing', 'Google Play Track', 'Instant Artifacts'],
  },
];

export default function WorkflowSteps() {
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
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 640, mx: 'auto' }}>
          <Typography
            sx={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            How Flotio Works
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
            From commit to release in 3 simple steps
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            Say goodbye to maintaining complex local build machines and outdated SDK toolchains.
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Grid container spacing={3.5}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    height: '100%',
                    p: { xs: 3.5, sm: 4 },
                    borderRadius: '20px',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-4px)',
                      boxShadow:
                        theme.palette.mode === 'light'
                          ? '0 12px 30px rgba(139,92,246,0.12)'
                          : '0 12px 30px rgba(0,0,0,0.35)',
                    },
                  }}
                >
                  {/* Step Number Background Watermark */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 18,
                      fontSize: '3.5rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.04)',
                      pointerEvents: 'none',
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </Typography>

                  <div>
                    {/* Icon + Number Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '14px',
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 92, 246, 0.12)'
                              : 'rgba(139, 92, 246, 0.06)',
                          border: `1px solid rgba(139, 92, 246, 0.25)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.4,
                          borderRadius: '6px',
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${theme.palette.divider}`,
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        STEP {step.number}
                      </Box>
                    </Box>

                    {/* Step Title & Subtitle */}
                    <Typography
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: theme.palette.primary.main,
                        mb: 1.5,
                      }}
                    >
                      {step.subtitle}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        mb: 3,
                      }}
                    >
                      {step.description}
                    </Typography>
                  </div>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    {step.tags.map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem',
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 13, color: theme.palette.success.main }} />
                        <span>{tag}</span>
                      </Box>
                    ))}
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
