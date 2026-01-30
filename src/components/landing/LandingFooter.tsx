'use client';

import { Box, Container, Typography, Stack, Link as MuiLink, useTheme } from '@mui/material';
import { Grid } from '@mui/material';
import Link from 'next/link';
import BoltIcon from '@mui/icons-material/Bolt';
import { colors } from '@/theme';

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

const footerSections: FooterSection[] = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'Infrastructure', href: '#' },
      { label: 'Previews', href: '#' },
      { label: 'Edge Functions', href: '#' },
      { label: 'Analytics', href: '#' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'API Reference', href: '#' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

const LandingFooter = () => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 10, md: 16 },
        mb: { xs: 10, md: 16 },
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ height: { xs: 40, md: 80 } }} />
      <Container maxWidth={false} sx={{ px: { xs: '32px', md: '120px' }, display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={16} sx={{ maxWidth: 1400 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4} sx={{ pr: { md: 8 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  background: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.common.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900],
                  border: `2px solid ${theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.common.white}`,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                F
              </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Flotio
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                  maxWidth: 340,
                  lineHeight: 1.5,
                }}
              >
                Empowering developers to launch better mobile apps. Scalable, secure, and effortless deployment infrastructure for every mobile team.
              </Typography>
            </Stack>
          </Grid>
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <Grid item xs={12} md={2} key={section.title}>
              <Stack spacing={2}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: '1.1rem',
                    letterSpacing: '0.01em',
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: `${theme.palette.text.secondary} !important`,
                      fontSize: '1.05rem',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'color 0.15s',
                      '&:hover': {
                        color: `${theme.palette.text.primary} !important`,
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
      <Box sx={{ height: { xs: 40, md: 80 } }} />
    </Box>
  );
};

export default LandingFooter;
