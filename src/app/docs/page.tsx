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
  TextField,
  InputAdornment,
  Chip,
  useTheme,
} from '@mui/material';
import Navbar from '@/components/landing/Navbar';
import LandingFooter from '@/components/landing/LandingFooter';
import DocsSidebar from '@/components/docs/DocsSidebar';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TerminalIcon from '@mui/icons-material/Terminal';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';

const allDocsMetadata = [
  {
    title: 'Introduction to Flotio',
    description: 'Discover Flotio, the modern CI/CD & cloud build platform built specifically for Flutter mobile applications.',
    category: 'Getting Started',
    order: 1,
    badge: 'Overview',
    slug: 'introduction',
    icon: <DescriptionIcon sx={{ fontSize: 26, color: '#8b5cf6' }} />,
    color: '#8b5cf6',
  },
  {
    title: 'Quickstart Guide',
    description: 'Connect a Git repository and run your first automated Flutter build in less than 5 minutes.',
    category: 'Getting Started',
    order: 2,
    badge: '5 min guide',
    slug: 'quickstart',
    icon: <PlayCircleOutlineIcon sx={{ fontSize: 26, color: '#0ea5e9' }} />,
    color: '#0ea5e9',
    spotlight: true,
  },
  {
    title: 'Flutter Build Configuration',
    description: 'Master build flavors, SDK versions, Dart defines, and code signing for Android & iOS.',
    category: 'Configuration',
    order: 3,
    badge: 'Technical',
    slug: 'flutter-configuration',
    icon: <SettingsSuggestIcon sx={{ fontSize: 26, color: '#f59e0b' }} />,
    color: '#f59e0b',
  },
  {
    title: 'Flotio CLI Reference',
    description: 'Complete command-line interface guide for Flotio continuous deployment and builds.',
    category: 'Tooling',
    order: 4,
    badge: 'CLI',
    slug: 'cli',
    icon: <TerminalIcon sx={{ fontSize: 26, color: '#10b981' }} />,
    color: '#10b981',
  },
  {
    title: 'Secrets & Code Signing Keys',
    description: 'Securely manage Android Keystores, Apple Certificates, Provisioning Profiles, and encrypted tokens.',
    category: 'Security & Signing',
    order: 5,
    badge: 'Security',
    slug: 'secrets-and-env',
    icon: <VpnKeyIcon sx={{ fontSize: 26, color: '#ec4899' }} />,
    color: '#ec4899',
  },
];

const categories = ['All', 'Getting Started', 'Configuration', 'Tooling', 'Security & Signing'];

export default function DocsHomePage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDocs = allDocsMetadata.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Main Layout Container with guaranteed top padding */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 12, md: 14 },
          pb: 12,
          flex: 1,
          display: 'flex',
          gap: { xs: 0, lg: 5 },
        }}
      >
        {/* Left Sticky Sidebar */}
        <DocsSidebar docs={allDocsMetadata} />

        {/* Center Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Hero Banner with Glow */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              mb: 6,
              borderRadius: '24px',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 8px 32px rgba(139, 92, 246, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Ambient Purple Glow */}
            <Box
              sx={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(40px)',
              }}
            />

            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
              {/* Badge */}
              <Box sx={{ display: 'inline-flex' }}>
                <Box
                  sx={{
                    display: 'flex',
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
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 15 }} />
                  <span>Flutter CI/CD Documentation</span>
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.75rem' },
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                }}
              >
                How can we help you{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  build today?
                </Box>
              </Typography>

              <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
                Everything you need to automate your Flutter mobile builds, Android Keystores, iOS Provisioning Profiles, and fast cloud distributions.
              </Typography>

              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search guides, CLI commands, signing keys, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            fontSize: '0.7rem',
                            fontFamily: 'monospace',
                            px: 1,
                            py: 0.3,
                            borderRadius: '4px',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                            color: theme.palette.text.secondary,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          CTRL + K
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.background.default,
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                      borderWidth: '1.5px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#8b5cf6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)',
                    },
                  },
                }}
              />
            </Stack>
          </Paper>

          {/* Category Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  borderRadius: '100px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  px: 0.5,
                  py: 2,
                  bgcolor: selectedCategory === cat ? '#8b5cf6' : theme.palette.background.paper,
                  color: selectedCategory === cat ? '#ffffff' : theme.palette.text.secondary,
                  border: selectedCategory === cat ? '1px solid #8b5cf6' : `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: selectedCategory === cat ? '#7c3aed' : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                    color: selectedCategory === cat ? '#ffffff' : theme.palette.text.primary,
                  },
                }}
              />
            ))}
          </Box>

          {/* Spotlight Quickstart Card (if matches) */}
          {selectedCategory === 'All' && !searchQuery && (
            <Paper
              component={Link}
              href="/docs/quickstart"
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 4.5 },
                mb: 5,
                borderRadius: '20px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(56, 189, 248, 0.04) 100%)',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'center' },
                justifyContent: 'space-between',
                gap: 3,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(139, 92, 246, 0.2)',
                },
              }}
            >
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <BoltIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.25rem' }}>
                    Quickstart Guide: Build in 5 Minutes
                  </Typography>
                  <Chip label="Recommended" size="small" sx={{ bgcolor: '#8b5cf6', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
                </Box>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.925rem', maxWidth: 580 }}>
                  Connect your GitHub repo, configure Android/iOS runner settings, and trigger your very first automated compilation run.
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  shrink: 0,
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                }}
              >
                <span>Start Tutorial</span>
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            </Paper>
          )}

          {/* Cards Grid */}
          <Grid container spacing={3}>
            {filteredDocs.map((doc) => (
              <Grid size={{ xs: 12, sm: 6 }} key={doc.slug}>
                <Paper
                  component={Link}
                  href={`/docs/${doc.slug}`}
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: '18px',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 16px rgba(0,0,0,0.25)'
                      : '0 4px 16px rgba(0,0,0,0.03)',
                    '&:hover': {
                      borderColor: doc.color,
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 24px ${doc.color}26`,
                    },
                  }}
                >
                  <Box>
                    {/* Top Row: Icon + Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: '12px',
                          bgcolor: theme.palette.mode === 'dark' ? `${doc.color}18` : `${doc.color}12`,
                          border: `1px solid ${doc.color}33`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {doc.icon}
                      </Box>
                      {doc.badge && (
                        <Box
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            px: 1.5,
                            py: 0.4,
                            borderRadius: '100px',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            color: theme.palette.text.secondary,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          {doc.badge}
                        </Box>
                      )}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: '1.1rem',
                        mb: 1,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {doc.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        mb: 3,
                      }}
                    >
                      {doc.description}
                    </Typography>
                  </Box>

                  {/* Read Link */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: doc.color,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowForwardIcon sx={{ fontSize: 15 }} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <LandingFooter />
    </Box>
  );
}
