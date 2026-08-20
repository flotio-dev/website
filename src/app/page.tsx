'use client';

import { Box, useTheme } from '@mui/material';
import {
  Navbar,
  Hero,
  WorkflowSteps,
  Features,
  CliShowcase,
  SecurityTrust,
  PricingPreview,
  DocsCards,
  LandingFooter,
} from '@/components/landing';
import { colors } from '@/theme';

export default function Page() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        bgcolor: isDark ? colors.background.dark.default : colors.background.light.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Global High-Tech Grid Motif */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? `
              linear-gradient(rgba(255, 87, 34, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 87, 34, 0.06) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(255, 87, 34, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 87, 34, 0.04) 1px, transparent 1px)
            `,
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(180deg, black 0%, black 85%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Ambient Top Flame Hero Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '700px',
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(255, 87, 34, 0.18) 0%, rgba(225, 29, 72, 0.06) 40%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(255, 87, 34, 0.1) 0%, rgba(225, 29, 72, 0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Ambient Mid-page Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          right: '-10%',
          width: '650px',
          height: '650px',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 107, 74, 0.08) 0%, rgba(225, 29, 72, 0.05) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 107, 74, 0.05) 0%, rgba(225, 29, 72, 0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      {/* Ambient Lower Glow */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 87, 34, 0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 87, 34, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar />
        <Hero />
        <WorkflowSteps />
        <Features />
        <CliShowcase />
        <SecurityTrust />
        <PricingPreview />
        <DocsCards />
        <LandingFooter />
      </Box>
    </Box>
  );
}
