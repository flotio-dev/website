'use client';

import { Box, Container, Typography, Stack, Link as MuiLink, useTheme, Grid } from '@mui/material';
import Link from 'next/link';
import { colors } from '@/theme';

interface FooterSection {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const LandingFooter = () => {
  const theme = useTheme();
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3001';

  const footerSections: FooterSection[] = [
    {
      title: 'PRODUCT',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Flutter Runners', href: '/#features' },
        { label: 'Launch Console', href: `${appBaseUrl}/dashboard`, external: true },
      ],
    },
    {
      title: 'DOCUMENTATION',
      links: [
        { label: 'Introduction', href: '/docs/introduction' },
        { label: 'Quickstart Guide', href: '/docs/quickstart' },
        { label: 'Build Configuration', href: '/docs/flutter-configuration' },
        { label: 'Flotio CLI', href: '/docs/cli' },
      ],
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'Documentation Hub', href: '/docs' },
        { label: 'Secrets & Keystores', href: '/docs/secrets-and-env' },
        { label: 'Contact Support', href: '/contact' },
        { label: 'GitHub Repository', href: 'https://github.com/flotio-dev', external: true },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 8, md: 10 },
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 4 }} justifyContent="space-between">
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5} sx={{ pr: { md: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  F
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Flotio
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  maxWidth: 380,
                  lineHeight: 1.6,
                }}
              >
                Empowering mobile developers to build, test, and release Flutter applications effortlessly with high-speed cloud infrastructure.
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem', pt: 1 }}>
                © {new Date().getFullYear()} Flotio. All rights reserved.
              </Typography>
            </Stack>
          </Grid>

          {/* Footer Navigation Columns */}
          {footerSections.map((section) => (
            <Grid size={{ xs: 6, sm: 4, md: 2.3 }} key={section.title}>
              <Stack spacing={1.75}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: '0.8rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    mb: 0.5,
                  }}
                >
                  {section.title}
                </Typography>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      fontWeight: 400,
                      transition: 'color 0.15s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingFooter;

