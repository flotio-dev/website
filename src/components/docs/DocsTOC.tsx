'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, useTheme, Link as MuiLink } from '@mui/material';
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
        width: 250,
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        borderLeft: `1px solid ${theme.palette.divider}`,
        pl: 3,
        position: 'sticky',
        top: 96,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        pb: 4,
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListBulletedIcon sx={{ fontSize: 16, color: '#ff5722' }} />
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: theme.palette.text.primary,
            }}
          >
            On this page
          </Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {toc.map((h) => {
            const isActive = activeId === h.id;
            return (
              <Box
                component="li"
                key={h.id}
                sx={{
                  pl: h.level === 3 ? 2 : 0,
                  mb: 1,
                }}
              >
                <MuiLink
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', `#${h.id}`);
                  }}
                  sx={{
                    display: 'block',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    textDecoration: 'none',
                    color: isActive ? '#ff5722' : theme.palette.text.secondary,
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? '2px solid #ff5722' : '2px solid transparent',
                    pl: 1.5,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      color: theme.palette.text.primary,
                      borderLeftColor: isActive ? '#ff5722' : 'rgba(255, 87, 34, 0.4)',
                    },
                  }}
                >
                  {h.text}
                </MuiLink>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
}
