"use client";

import { Paper, Box, Typography, Button, Select, MenuItem, useTheme } from '@mui/material';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { colors } from '@/theme';

const LANGUAGES = [
  { code: 'EN', label: 'English', description: 'Interface displayed in English.' },
  { code: 'FR', label: 'Français', description: 'Interface affichée en français.' },
];

function LanguageSelector() {
  const theme = useTheme();
  const [language, setLanguage] = useState('EN');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          <LanguageIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '1.2rem' }}>
          Langue de l'interface
        </Typography>
      </Box>

      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.925rem', mb: 3.5, maxWidth: 540, lineHeight: 1.6 }}>
        Choisissez votre langue d’affichage par défaut pour la console et la documentation.
      </Typography>

      <Box sx={{ maxWidth: 460, mb: 3.5 }}>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          fullWidth
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: '12px',
            fontWeight: 500,
            fontSize: '0.95rem',
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: theme.palette.background.paper,
                borderRadius: '14px',
                border: `1px solid ${theme.palette.divider}`,
                mt: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              },
            },
          }}
          renderValue={(selected) => {
            const lang = LANGUAGES.find((l) => l.code === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: colors.primary.main,
                  }}
                >
                  {lang?.code}
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: theme.palette.text.primary }}>
                  {lang?.label}
                </Typography>
              </Box>
            );
          }}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              value={lang.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.5,
                px: 2,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: colors.primary.main,
                }}
              >
                {lang.code}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: theme.palette.text.primary }}>
                  {lang.label}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                  {lang.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ pt: 2.5, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={saved ? <CheckCircleOutlineIcon /> : undefined}
          sx={{
            background: saved ? '#22c55e' : colors.primary.gradient,
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '10px',
            px: 3,
            py: 1,
            boxShadow: 'none',
            textTransform: 'none',
            transition: 'all 0.2s',
            '&:hover': {
              background: saved ? '#16a34a' : colors.primary.gradientHover,
              boxShadow: `0 4px 16px ${colors.primary.light}4d`,
            },
          }}
        >
          {saved ? 'Enregistré !' : 'Enregistrer la langue'}
        </Button>
      </Box>
    </Paper>
  );
}

export default LanguageSelector;
