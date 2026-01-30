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
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { colors } from '@/theme';

const navItems = [
  { label: 'Product', href: '#' },
  { label: 'Documentation', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Preferences', href: '/preferences' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  // Force update du composant quand le thème change pour appliquer les couleurs dynamiques
  // Utilise useEffect pour écouter le changement de mode
  const [, setThemeMode] = useState(theme.palette.mode);
  useEffect(() => {
    setThemeMode(theme.palette.mode);
  }, [theme.palette.mode]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: trigger ? `${theme.palette.background.default}b3` : 'transparent',
          backdropFilter: trigger ? 'blur(16px) saturate(180%)' : 'none',
          borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none',
          transition: 'all 0.2s ease',
          pr: { xs: '0!important', md: '20px!important' },
          pl: { xs: '0!important', md: '20px!important' },
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                fontWeight: 700,
                color: `${theme.palette.text.primary}!important`,
                textDecoration: 'none',
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'color 0.2s',
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  background: `${colors.primary.gradient}!important`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: `${theme.palette.background.default}!important`,
                  transition: 'color 0.2s, background 0.2s',
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
                    color: `${theme.palette.text.secondary}!important`,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    transition: 'color 0.2s, background 0.2s',
                    '&:hover': {
                      color: `${theme.palette.text.primary}!important`,
                      bgcolor: `${theme.palette.action.hover}!important`,
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
                href="/auth/login"
                sx={{
                  color: `${theme.palette.text.secondary}!important`,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2,
                  transition: 'color 0.2s, background 0.2s',
                  '&:hover': {
                    color: `${theme.palette.text.primary}!important`,
                    bgcolor: 'transparent!important',
                  },
                }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href="/auth/register"
                variant="contained"
                sx={{
                  background: `${colors.primary.gradient}!important`,
                  color: `${theme.palette.text.primary}!important`,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.875,
                  boxShadow: 'none',
                  transition: 'color 0.2s, background 0.2s',
                  '&:hover': {
                    background: `${colors.primary.gradientHover}!important`,
                    boxShadow: `0 4px 16px ${colors.primary.light}4d`,
                  },
                }}
              >
                Sign up
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{
                display: { md: 'none' },
                ml: 'auto',
                color: `${theme.palette.text.primary}!important`,
                transition: 'color 0.2s',
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
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
            transition: 'background 0.2s, border-color 0.2s',
          },
        }}
      >
        <Box sx={{ p: 3, px: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: `${theme.palette.text.primary}!important` }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: '8px',
                    py: 1.5,
                    transition: 'background 0.2s, color 0.2s',
                    '&:hover': {
                      bgcolor: `${theme.palette.action.hover}!important`,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: `${theme.palette.text.secondary}!important`, fontWeight: 500, transition: 'color 0.2s' },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button
              component={Link}
              href="/auth/login"
              fullWidth
              sx={{
                color: `${theme.palette.text.primary}!important`,
                border: `1px solid ${theme.palette.divider}!important`,
                borderRadius: '8px',
                py: 1.25,
                textTransform: 'none',
                fontWeight: 500,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: `${theme.palette.text.primary}!important`,
                color: `${theme.palette.background.default}!important`,
                borderRadius: '8px',
                py: 1.25,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                transition: 'color 0.2s, background 0.2s',
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
