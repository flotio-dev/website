'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Grid, useTheme, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Button from '@/components/ui/Button';

interface Plan {
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  highlighted?: boolean;
  features: string[];
  ctaText: string;
}

const plans: Plan[] = [
  {
    name: 'Free Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Flotio and indie mobile hobby projects.',
    features: [
      '500 Cloud build minutes / month',
      '1 Concurrent build runner',
      'Automatic GitHub webhooks',
      'Encrypted Android Keystores',
      'Standard community support',
    ],
    ctaText: 'Start Building Free',
  },
  {
    name: 'Growth Credits',
    price: '$150',
    period: 'pay-as-you-go',
    badge: 'MOST POPULAR',
    highlighted: true,
    description: 'Ideal for fast-shipping mobile development teams and studios.',
    features: [
      '~11,500 Linux build minutes (+15% Bonus)',
      '4 Concurrent builds with Priority Queue',
      'Automated Google Play Store delivery',
      'Custom Dart defines & flavor matrices',
      'Priority ticket & Discord support',
    ],
    ctaText: 'Get Growth Pack',
  },
  {
    name: 'Scale Studio',
    price: '$500',
    period: 'pay-as-you-go',
    badge: '+25% BONUS',
    description: 'High-capacity compute for agencies and multi-app enterprises.',
    features: [
      '~41,500 Linux build minutes',
      '8+ Concurrent builds & zero wait time',
      'Custom pre-warmed Flutter cache',
      'Dedicated Slack channel & 99.9% SLA',
      'Multi-team access & audit logs',
    ],
    ctaText: 'Get Scale Pack',
  },
];

export default function PricingPreview() {
  const theme = useTheme();
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const registerHref = appBaseUrl ? `${appBaseUrl}/auth/register` : '/auth/register';

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
            Transparent Pricing
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
            Pay only for what you build
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            No subscription lock-in. Top up build minutes whenever you need them with transparent per-second billing.
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={3.5} alignItems="stretch">
          {plans.map((plan, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    height: '100%',
                    p: { xs: 3.5, sm: 4 },
                    borderRadius: '24px',
                    bgcolor: theme.palette.background.paper,
                    border: plan.highlighted
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: plan.highlighted
                      ? '0 12px 35px rgba(255, 87, 34, 0.2)'
                      : '0 2px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(255, 87, 34, 0.25)',
                    },
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        right: 24,
                        px: 2,
                        py: 0.5,
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #ff6b4a 0%, #e11d48 100%)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(255, 87, 34, 0.4)',
                      }}
                    >
                      {plan.badge}
                    </Box>
                  )}

                  <div>
                    <Typography
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                        minHeight: 40,
                        lineHeight: 1.5,
                        mb: 2.5,
                      }}
                    >
                      {plan.description}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
                      <Typography
                        sx={{
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          fontFamily: 'monospace',
                          lineHeight: 1,
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                        / {plan.period}
                      </Typography>
                    </Box>

                    {/* Features List */}
                    <Stack spacing={1.5} sx={{ mb: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                      {plan.features.map((feat) => (
                        <Box key={feat} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                          <CheckCircleIcon
                            sx={{
                              fontSize: 16,
                              color: plan.highlighted ? theme.palette.primary.main : theme.palette.success.main,
                              mt: 0.25,
                              flexShrink: 0,
                            }}
                          />
                          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.86rem', lineHeight: 1.4 }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </div>

                  {/* CTA */}
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    href={registerHref}
                    sx={{ width: '100%', py: 1.25 }}
                  >
                    {plan.ctaText}
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Link to Full Pricing Page */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <span>Explore all credit packages, custom quotas & FAQs</span>
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
