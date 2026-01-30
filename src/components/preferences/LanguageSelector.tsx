"use client";

import { Paper, Box, Typography, Stack, Radio, useTheme, Button, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { colors } from '@/theme';

const LANGUAGES = [
  { code: 'EN', label: 'English', description: 'Interface in English.' },
  { code: 'FR', label: 'Français', description: 'Interface en français.' },
];

function LanguageSelector() {
  const theme = useTheme();
  const [language, setLanguage] = useState('EN');

  return (
    <Box
      sx={{
        width: '100vw',
    }}
    >
      <Box sx={{ width: '80% !important', mx: 'auto !important', mt: '100px !important', mb: '20px !important' }}>
        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '1.18rem', mb: 0.5 }}>
          Language
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', mb: 3 }}>
          Sélectionnez simplement la langue de l’interface.
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 0, md: 0 }, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Paper
          sx={{
            bgcolor: theme.palette.background.paper,
            border: `1.5px solid ${theme.palette.divider}`,
            borderRadius: '14px',
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
            width: '80%',
          }}
        >
          <Box sx={{ mt: '40px !important', ml: '40px !important' }}>
            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '1.18rem', mb: 0.5 }}>
              Interface language
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', mb: 3 }}>
              Choisissez la langue d’affichage de l’interface.
            </Typography>
          </Box>
                      <Select
              labelId="language-select-label"
              value={language}
              label="Langue"
              onChange={e => setLanguage(e.target.value)}
              sx={{
                bgcolor: `${theme.palette.background.default}!important`,
                borderRadius: '12px!important',
                fontWeight: 500,
                fontSize: '1.08rem!important',
                py: '1.5!important',
                px: '2!important',
                width: 'calc(100% - 80px)!important',
                minHeight: '56px!important',
                boxShadow: 'none!important',
                border: `1.5px solid ${theme.palette.divider}!important`,
                mt: '40px!important',
                ml: '40px!important',
                mr: '40px!important',
                mb: '40px!important',
                '& .MuiSelect-select': {
                  display: 'flex!important',
                  alignItems: 'center!important',
                  gap: '16px!important',
                  py: '1.5!important',
                  px: '8px!important',
                },
                '& fieldset': {
                  border: 'none!important',
                },
                '&:hover': {
                  bgcolor: `${theme.palette.background.paper}!important`,
                  borderColor: `${theme.palette.primary.light}!important`,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: '12px',
                  },
                },
              }}
              renderValue={selected => {
                const lang = LANGUAGES.find(l => l.code === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor: theme.palette.background.paper,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.divider}`,
                        mr: 2,
                      }}
                    >
                      {lang?.code}
                    </Box>
                    <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                      {lang?.label}
                    </Typography>
                  </Box>
                );
              }}
            >
              {LANGUAGES.map((lang, idx) => (
                <MenuItem
                  key={lang.code}
                  value={lang.code}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: '14px!important',
                    px: '18px!important',
                    borderRadius: idx === LANGUAGES.length - 1 ? '0 0 10px 10px!important' : '0!important',
                    mb: 0,
                    minHeight: '48px!important',
                    background: 'none',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover + '!important',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: theme.palette.background.paper,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.divider}`,
                      mr: 2,
                    }}
                  >
                    {lang.code}
                  </Box>
                  <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                    {lang.label}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          <Box sx={{ borderTop: `1.5px solid ${theme.palette.divider}` }}>
            <Box sx={{ my: '40px !important', ml: '40px !important', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{
                  background: colors.primary.gradient,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '10px',
                  px: 3,
                  py: 1.25,
                  p: '7px 18px!important',
                  boxShadow: 'none',
                  textTransform: 'none',
                  mr: '16px!important',
                  '&:hover': {
                    background: colors.primary.gradientHover,
                    boxShadow: `0 4px 16px ${colors.primary.light}4d`,
                  },
                }}
              >
                Save language
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default LanguageSelector;
