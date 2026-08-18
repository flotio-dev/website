"use client";

import { Paper, Box, Typography, Stack, Radio, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PaletteIcon from '@mui/icons-material/Palette';
import { useContext } from 'react';
import { ThemeModeContext } from './ThemeModeProvider';
import { colors } from '@/theme';

function ThemeSwitcher() {
  const { mode, setMode } = useContext(ThemeModeContext);
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '20px',
        p: { xs: 3, sm: 4.5 },
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0, 0, 0, 0.25)'
          : '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary.main,
          }}
        >
          <PaletteIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '1.2rem' }}>
          Thème & Apparence
        </Typography>
      </Box>

      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.925rem', mb: 3.5, maxWidth: 540, lineHeight: 1.6 }}>
        Choisissez entre le thème clair et sombre. Votre choix s’applique immédiatement à toute l’interface.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ mb: 3.5 }}>
        {/* Light mode card */}
        <Box
          onClick={() => setMode('light')}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: '16px',
            border: mode === 'light'
              ? `2px solid ${colors.primary.main}`
              : `1px solid ${theme.palette.divider}`,
            bgcolor: mode === 'light'
              ? (theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)')
              : theme.palette.background.default,
            boxShadow: mode === 'light' ? `0 4px 16px rgba(139, 92, 246, 0.15)` : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: colors.primary.main,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              bgcolor: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              flexShrink: 0,
            }}
          >
            <LightModeIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '1rem', mb: 0.25 }}>
              Light
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.825rem', lineHeight: 1.4 }}>
              Interface claire et épurée.
            </Typography>
          </Box>
          <Radio
            checked={mode === 'light'}
            value="light"
            sx={{
              color: theme.palette.divider,
              '&.Mui-checked': {
                color: colors.primary.main,
              },
            }}
            onChange={() => setMode('light')}
          />
        </Box>

        {/* Dark mode card */}
        <Box
          onClick={() => setMode('dark')}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: '16px',
            border: mode === 'dark'
              ? `2px solid ${colors.primary.main}`
              : `1px solid ${theme.palette.divider}`,
            bgcolor: mode === 'dark'
              ? (theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.04)')
              : theme.palette.background.default,
            boxShadow: mode === 'dark' ? `0 4px 16px rgba(139, 92, 246, 0.2)` : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: colors.primary.main,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              bgcolor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary.main,
              flexShrink: 0,
            }}
          >
            <DarkModeIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '1rem', mb: 0.25 }}>
              Dark
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.825rem', lineHeight: 1.4 }}>
              Interface sombre avec accents violets.
            </Typography>
          </Box>
          <Radio
            checked={mode === 'dark'}
            value="dark"
            sx={{
              color: theme.palette.divider,
              '&.Mui-checked': {
                color: colors.primary.main,
              },
            }}
            onChange={() => setMode('dark')}
          />
        </Box>
      </Stack>

      <Box sx={{ pt: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', lineHeight: 1.5 }}>
          {mode === 'dark'
            ? "🌙 Le thème sombre réduit la fatigue oculaire lors des sessions de développement prolongées."
            : "☀️ Le thème clair offre une clarté maximale dans les environnements lumineux."}
        </Typography>
      </Box>
    </Paper>
  );
}

export default ThemeSwitcher;
