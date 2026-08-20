'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { colors } from '@/theme';

const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Preferences', href: '/preferences' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const loginHref = appBaseUrl ? `${appBaseUrl}/auth/login` : '/auth/login';
  const registerHref = appBaseUrl ? `${appBaseUrl}/auth/register` : '/auth/register';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: trigger
            ? theme.palette.mode === 'dark'
              ? 'rgba(13, 14, 18, 0.85)'
              : 'rgba(248, 250, 252, 0.85)'
            : 'transparent',
          backdropFilter: trigger ? 'blur(16px) saturate(180%)' : 'none',
          borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none',
          transition: 'all 0.25s ease',
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                textDecoration: 'none',
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.9 },
              }}
            >
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
                  boxShadow: '0 2px 10px rgba(139, 92, 246, 0.35)',
                }}
              >
                F
              </Box>
              Flotio
            </Box>

            {/* Desktop Nav - Centered with flex */}
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 2,
                    py: 0.8,
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: theme.palette.text.primary,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Auth Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
              <Button
                component={Link}
                href={loginHref}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2,
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: theme.palette.text.primary,
                    bgcolor: 'transparent',
                  },
                }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href={registerHref}
                variant="contained"
                sx={{
                  background: colors.primary.gradient,
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.85,
                  boxShadow: '0 2px 12px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: colors.primary.gradientHover,
                    boxShadow: `0 4px 16px ${colors.primary.light}66`,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Actions */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <IconButton
                sx={{
                  color: `${theme.palette.text.primary}!important`,
                }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 3, px: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                F
              </Box>
              <Typography sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1rem' }}>
                Flotio
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: theme.palette.text.primary }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 0 }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: '8px',
                    py: 1.25,
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: theme.palette.text.primary, fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            <Button
              component={Link}
              href={loginHref}
              fullWidth
              sx={{
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                py: 1.25,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href={registerHref}
              variant="contained"
              fullWidth
              sx={{
                background: colors.primary.gradient,
                color: '#ffffff',
                borderRadius: '8px',
                py: 1.25,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
              }}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

