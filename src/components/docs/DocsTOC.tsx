'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import type { TOCItem } from '@/lib/markdown';

interface DocsTOCProps {
  toc: TOCItem[];
}

export default function DocsTOC({ toc }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 140;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          return;
        }
      }
      if (headings.length > 0 && headings[0]) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        display: { xs: 'none', xl: 'block' },
        borderLeft: `1px solid ${theme.palette.divider}`,
        pl: 3,
        position: 'sticky',
        top: 84,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListBulletedIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: theme.palette.text.secondary,
            }}
          >
            On this page
          </Typography>
        </Box>

        <Stack spacing={0.75}>
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Box
                key={item.id}
                component="a"
                href={`#${item.id}`}
                sx={{
                  display: 'block',
                  py: 0.5,
                  pl: item.level === 3 ? 2 : 0,
                  fontSize: item.level === 3 ? '0.8rem' : '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#8b5cf6' : theme.palette.text.secondary,
                  textDecoration: 'none',
                  borderLeft: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                  paddingLeft: isActive ? '8px' : (item.level === 3 ? '12px' : '4px'),
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {item.text}
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
