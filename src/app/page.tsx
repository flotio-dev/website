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
              linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px)
            `,
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(180deg, black 0%, black 85%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Ambient Top Violet Hero Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '700px',
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 70%)',
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
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
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
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
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
