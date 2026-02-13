'use client';

import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@/components/ui/Button';
import { colors } from '@/theme';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function Hero() {
  const theme = useTheme();
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const registerHref = appBaseUrl ? `${appBaseUrl}/auth/register` : '/auth/register';
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? colors.heroBackground.dark
          : colors.heroBackground.light,
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 0 },
      }}
    >
      {/* Subtle grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${theme.palette.divider} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

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
        <Stack spacing={10} alignItems="center" textAlign="center">
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
                fontWeight: 600,
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                color: theme.palette.text.primary,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              The complete platform for
            </Typography>
            <Typography
              variant="h1"
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.secondary.main} 80%, ${theme.palette.secondary.light} 100%)`,
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
              maxWidth: '560px',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
            }}
          >
            Flotio provides the infrastructure, workflows, and tools you need to deploy Flutter mobile apps simply, quickly, and with easy access.
          </MotionTypography>
          {/* CTA Buttons */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ paddingTop: '60px' }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 4 }}>
              <Button
                variant="primary"
                href={registerHref}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 22 }} />}
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
        </Stack>
      </Container>
    </Box>
  );
}
