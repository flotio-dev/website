'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
} from '@mui/material';
import Navbar from '@/components/landing/Navbar';
import LandingFooter from '@/components/landing/LandingFooter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';

interface CreditPack {
  name: string;
  price: number;
  bonus: string;
  popular?: boolean;
  features: string[];
  description: string;
  buttonText: string;
}

const creditPacks: CreditPack[] = [
  {
    name: 'Starter Credits',
    price: 50,
    bonus: '+5% Bonus Credits',
    description: 'Perfect for indie developers releasing Flutter mobile apps regularly.',
    features: [
      '~3,500 Linux build minutes OR ~1,150 macOS M2 minutes',
      '2 Concurrent builds',
      'Android APK/AAB & iOS IPA compilation',
      'Encrypted Keystores & Apple Certificates vault',
      '30 Days artifacts retention',
      'Standard email support',
    ],
    buttonText: 'Buy Starter Pack',
  },
  {
    name: 'Growth Pack',
    price: 150,
    bonus: '+15% Bonus Credits',
    popular: true,
    description: 'Ideal for fast-moving startups and mobile development studios.',
    features: [
      '~11,500 Linux build minutes OR ~3,800 macOS M2 minutes',
      '4 Concurrent builds with Priority Queue',
      'Automated code signing & Fastlane integration',
      'Custom Dart defines & flavor workflows',
      '60 Days artifacts retention',
      'Priority ticket & Discord support',
    ],
    buttonText: 'Buy Growth Pack',
  },
  {
    name: 'Scale Studio',
    price: 500,
    bonus: '+25% Bonus Credits',
    description: 'High-capacity compute for agencies and multi-app enterprise engineering teams.',
    features: [
      '~41,500 Linux build minutes OR ~13,800 macOS M2 minutes',
      '8+ Concurrent builds & zero queue time',
      'Dedicated Apple Silicon bare-metal runners',
      'Custom pre-warmed Flutter cache',
      '90 Days artifacts retention',
      'Dedicated Slack channel & 99.9% uptime SLA',
    ],
    buttonText: 'Buy Scale Pack',
  },
];

const faqs = [
  {
    q: 'How are build minutes tracked and billed?',
    a: 'Build time is measured per second from the moment your runner starts compiling to artifact upload completion. There are no minimum charge blocks or round-up penalties.',
  },
  {
    q: 'How do iOS builds work without needing a physical Mac?',
    a: 'Flotio provisions dedicated Apple Silicon M2 runner instances pre-installed with the latest Xcode toolchains and CocoaPods. You can compile signed iOS .ipa packages completely in the cloud.',
  },
  {
    q: 'Are my keystores, passwords, and Apple certificates secure?',
    a: 'Yes. All secrets and signing certificates are encrypted with AES-256 at rest and are only injected temporarily into isolated, single-use runner sandboxes that are wiped immediately after the build finishes.',
  },
  {
    q: 'Do unused build credits expire?',
    a: 'No. Purchased credits remain active on your account indefinitely and never expire. Free monthly minutes reset at the beginning of each billing cycle.',
  },
  {
    q: 'Can I set spending limits or auto-reload for my team?',
    a: 'Yes. You can configure monthly budget caps and optional auto-recharge rules in your organization preferences to prevent build disruptions.',
  },
];

export default function PricingPage() {
  const theme = useTheme();
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(500);
  const [machineType, setMachineType] = useState<'linux' | 'macos'>('linux');

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3001';
  const registerHref = `${appBaseUrl}/auth/register`;

  const ratePerMinute = machineType === 'linux' ? 0.015 : 0.045;
  const calculatedCost = Math.max(0, (estimatedMinutes - 100) * ratePerMinute);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 14, flex: 1 }}>
        {/* Header Hero */}
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 10 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: '100px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#8b5cf6',
              fontSize: '0.8rem',
              fontWeight: 600,
              mb: 3,
            }}
          >
            <BoltIcon sx={{ fontSize: 16 }} />
            <span>Pay-As-You-Go & Build Credits</span>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3.25rem' },
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 2.5,
            }}
          >
            Transparent pricing for{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Flutter CI/CD
            </Box>
          </Typography>

          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Start completely free with 100 monthly minutes. Only pay for the build minutes you actually consume with zero lock-in.
          </Typography>
        </Box>

        {/* Free Tier Spotlight Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            mb: 10,
            borderRadius: '24px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
            border: '1.5px solid rgba(34, 197, 94, 0.3)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon sx={{ color: '#22c55e', fontSize: 20 }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#22c55e' }}>
                Included With Every Account
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
              100 Free Linux Build Minutes / Month
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem', maxWidth: 620, lineHeight: 1.6 }}>
              No credit card required. Build, test, and release your Android APKs and Flutter packages for free every month.
            </Typography>
          </Stack>

          <Box
            component={Link}
            href={registerHref}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3.5,
              py: 1.75,
              borderRadius: '12px',
              bgcolor: '#22c55e',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              shrink: 0,
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#16a34a',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.45)',
              },
            }}
          >
            <span>Get Started Free</span>
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Paper>

        {/* Interactive Pay-As-You-Go Visual Calculator */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            mb: 12,
            borderRadius: '24px',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.text.primary, mb: 1.5 }}>
                Estimate your monthly usage
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
                Select your runner architecture and drag the slider to project exact costs.
              </Typography>
            </Box>

            {/* Runner Selector Pills */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: '14px',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box
                  onClick={() => setMachineType('linux')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    bgcolor: machineType === 'linux' ? '#8b5cf6' : 'transparent',
                    color: machineType === 'linux' ? '#ffffff' : theme.palette.text.secondary,
                    boxShadow: machineType === 'linux' ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <AndroidIcon sx={{ fontSize: 18 }} />
                  <span>Linux Standard (0.015 € / min)</span>
                </Box>

                <Box
                  onClick={() => setMachineType('macos')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    bgcolor: machineType === 'macos' ? '#8b5cf6' : 'transparent',
                    color: machineType === 'macos' ? '#ffffff' : theme.palette.text.secondary,
                    boxShadow: machineType === 'macos' ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <AppleIcon sx={{ fontSize: 18 }} />
                  <span>Apple Silicon M2 (0.045 € / min)</span>
                </Box>
              </Box>
            </Box>

            {/* Slider */}
            <Box sx={{ px: { xs: 2, sm: 4 }, mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                  Build Minutes Per Month:
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#8b5cf6', fontFamily: 'monospace' }}>
                  {estimatedMinutes} min
                </Typography>
              </Box>

              <Slider
                value={estimatedMinutes}
                min={50}
                max={3000}
                step={50}
                onChange={(_, val) => setEstimatedMinutes(val as number)}
                sx={{
                  color: '#8b5cf6',
                  height: 8,
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    bgcolor: '#ffffff',
                    border: '3px solid #8b5cf6',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 1 }}>
                <span>50 min</span>
                <span>1 000 min</span>
                <span>2 000 min</span>
                <span>3 000 min</span>
              </Box>
            </Box>

            {/* Price Result Box */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: '16px',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                border: '1.5px solid rgba(139, 92, 246, 0.25)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8b5cf6' }}>
                  Estimated Monthly Total (After 100 free minutes)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: theme.palette.text.primary, fontFamily: 'monospace' }}>
                    {calculatedCost === 0 ? '0.00' : calculatedCost.toFixed(2)} €
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                    / month
                  </Typography>
                </Box>
              </Stack>

              <Box
                component={Link}
                href={registerHref}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#7c3aed',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Start with Pay-As-You-Go
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Credit Packs Grid */}
        <Box sx={{ mb: 14 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.25rem' }, color: theme.palette.text.primary, mb: 1.5 }}>
              Prepaid Credit Packs
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
              Prepay build credits and receive up to 25% extra bonus computing capacity.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {creditPacks.map((pack) => (
              <Grid size={{ xs: 12, md: 4 }} key={pack.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4.5,
                    height: '100%',
                    borderRadius: '24px',
                    bgcolor: theme.palette.background.paper,
                    border: pack.popular ? '2px solid #8b5cf6' : `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: pack.popular
                      ? '0 12px 40px rgba(139, 92, 246, 0.18)'
                      : (theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)'),
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(139, 92, 246, 0.22)',
                    },
                  }}
                >
                  {pack.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        px: 2.5,
                        py: 0.5,
                        borderRadius: '100px',
                        bgcolor: '#8b5cf6',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      Most Popular
                    </Box>
                  )}

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: theme.palette.text.primary }}>
                        {pack.name}
                      </Typography>
                      <Chip label={pack.bonus} size="small" sx={{ bgcolor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', fontWeight: 700, fontSize: '0.7rem' }} />
                    </Box>

                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', minHeight: 40, mb: 3 }}>
                      {pack.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, pb: 3, mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography sx={{ fontSize: '2.75rem', fontWeight: 800, color: theme.palette.text.primary, fontFamily: 'monospace' }}>
                        {pack.price} €
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                        one-time credits
                      </Typography>
                    </Box>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {pack.features.map((f, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#22c55e', mt: 0.2, shrink: 0 }} />
                          <span>{f}</span>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box
                    component={Link}
                    href={registerHref}
                    sx={{
                      width: '100%',
                      py: 1.5,
                      borderRadius: '12px',
                      bgcolor: pack.popular ? '#8b5cf6' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                      color: pack.popular ? '#ffffff' : theme.palette.text.primary,
                      border: pack.popular ? 'none' : `1px solid ${theme.palette.divider}`,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'block',
                      boxShadow: pack.popular ? '0 4px 14px rgba(139, 92, 246, 0.35)' : 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: pack.popular ? '#7c3aed' : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
                      },
                    }}
                  >
                    {pack.buttonText}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQs Accordion */}
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.25rem' }, color: theme.palette.text.primary, mb: 1.5 }}>
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
              Everything you need to know about Flotio billing, cloud runners, and security.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {faqs.map((faq, i) => (
              <Accordion
                key={i}
                elevation={0}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '16px !important',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8b5cf6' }} />}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      </Container>

      <LandingFooter />
    </Box>
  );
}
