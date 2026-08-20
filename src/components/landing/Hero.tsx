'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, useTheme, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TerminalIcon from '@mui/icons-material/Terminal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@/components/ui/Button';
import { colors } from '@/theme';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function Hero() {
  const theme = useTheme();
  const [copiedCli, setCopiedCli] = useState(false);
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const registerHref = appBaseUrl ? `${appBaseUrl}/auth/register` : '/auth/register';

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText('flotio build start --watch');
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Box
      sx={{
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        pt: { xs: 16, md: 18 },
        pb: { xs: 10, md: 14 },
      }}
    >
      {/* Glow effect top */}
      <Box
        sx={{
          position: 'absolute',
          top: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          height: '60%',
          background: `radial-gradient(ellipse at center, ${theme.palette.primary.light}1f 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
          {/* Badge */}
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 0.75,
                borderRadius: '100px',
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: theme.palette.success.main,
                  boxShadow: `0 0 8px ${theme.palette.success.main}`,
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Flotio is now available for the Proof of Concept phase !
              </Typography>
            </Box>
          </MotionBox>

          {/* Main Title */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4.25rem' },
                color: theme.palette.text.primary,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
              }}
            >
              The complete platform for
            </Typography>
            <Typography
              variant="h1"
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4.25rem' },
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #ff6b4a 0%, #ff5722 40%, #e11d48 80%, #be123c 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
              }}
            >
              modern deployments
            </Typography>
          </MotionBox>

          {/* Subtitle */}
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '580px',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
            }}
          >
            Flotio provides the infrastructure, workflows, and tools you need to deploy Flutter mobile apps simply, quickly, and with easy access.
          </MotionTypography>

          {/* CTA Buttons */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            sx={{ pt: { xs: 1, sm: 2 } }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }} alignItems="center">
              <Button
                variant="primary"
                href={registerHref}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
              >
                Start Deploying
              </Button>
              <Button
                variant="secondary"
                href="/docs"
              >
                Read Documentation
              </Button>
            </Stack>
          </MotionBox>

          {/* Mini CLI Preview Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            sx={{ pt: 1 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: { xs: 2, sm: 2.5 },
                py: 1,
                borderRadius: '12px',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(13, 16, 23, 0.9)'
                    : 'rgba(241, 245, 249, 0.9)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 87, 34, 0.15)'
                    : '0 4px 15px rgba(255, 87, 34, 0.1)',
                maxWidth: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontFamily: 'monospace',
                  fontSize: { xs: '0.78rem', sm: '0.85rem' },
                }}
              >
                <TerminalIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 'inherit',
                    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                    fontWeight: 500,
                  }}
                >
                  <strong style={{ color: '#10b981' }}>$</strong> flotio build start --watch
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '1px',
                  height: 14,
                  bgcolor: theme.palette.divider,
                  mx: 0.25,
                  display: { xs: 'none', sm: 'block' },
                }}
              />

              <Tooltip title={copiedCli ? 'Copied!' : 'Copy command'}>
                <IconButton
                  onClick={handleCopyCli}
                  size="small"
                  sx={{
                    p: 0.5,
                    borderRadius: '6px',
                    color: copiedCli ? '#10b981' : theme.palette.text.secondary,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      color: theme.palette.text.primary,
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                  aria-label="Copy CLI command"
                >
                  {copiedCli ? (
                    <CheckIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
}
