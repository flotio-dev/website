'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TerminalIcon from '@mui/icons-material/Terminal';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import type { DocMetadata } from '@/lib/markdown';

interface DocsSidebarProps {
  docs: DocMetadata[];
}

export default function DocsSidebar({ docs }: DocsSidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();

  // Group by category
  const categories: Record<string, DocMetadata[]> = {};
  for (const doc of docs) {
    if (!categories[doc.category]) {
      categories[doc.category] = [];
    }
    categories[doc.category].push(doc);
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return <PlayCircleOutlineIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />;
      case 'Configuration':
        return <SettingsSuggestIcon sx={{ fontSize: 16, color: '#38bdf8' }} />;
      case 'Tooling':
        return <TerminalIcon sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'Security & Signing':
        return <VpnKeyIcon sx={{ fontSize: 16, color: '#ec4899' }} />;
      default:
        return <AutoStoriesIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />;
    }
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', lg: 280 },
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        borderRight: `1px solid ${theme.palette.divider}`,
        pr: 3,
        position: 'sticky',
        top: 84,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        pb: 6,
      }}
    >
      <Stack spacing={3.5}>
        {/* Hub Link */}
        <Box
          component={Link}
          href="/docs"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.25,
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: pathname === '/docs' ? 700 : 500,
            bgcolor: pathname === '/docs' ? (theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)') : 'transparent',
            color: pathname === '/docs' ? '#8b5cf6' : theme.palette.text.primary,
            border: pathname === '/docs' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            },
          }}
        >
          <AutoStoriesIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
          <span>Documentation Hub</span>
        </Box>

        {/* Categories */}
        {Object.entries(categories).map(([category, items]) => (
          <Stack key={category} spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5 }}>
              {getCategoryIcon(category)}
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: theme.palette.text.secondary,
                }}
              >
                {category}
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              {items.map((item) => {
                const href = `/docs/${item.slug}`;
                const isActive = pathname === href;

                return (
                  <Box
                    key={item.slug}
                    component={Link}
                    href={href}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 400,
                      bgcolor: isActive ? (theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)') : 'transparent',
                      color: isActive ? '#8b5cf6' : theme.palette.text.secondary,
                      borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        color: theme.palette.text.primary,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        pl: 2.2,
                      },
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <Box
                        component="span"
                        sx={{
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                          px: 1,
                          py: 0.25,
                          borderRadius: '100px',
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                          color: theme.palette.text.secondary,
                          border: `1px solid ${theme.palette.divider}`,
                          flexShrink: 0,
                          ml: 1,
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
