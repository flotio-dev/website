'use client';

import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import Menu from '../components/Menu';
import { useEffect, useMemo, useState } from 'react';
import { getTranslations } from '../../lib/clientTranslations';

// ---- Types
type EnvName = 'development' | 'preview' | 'production';
type Visibility = 'plain' | 'secret';

interface EnvVar {
  id: string;
  name: string;
  value: string;
  envs: EnvName[];
  visibility: Visibility;
  updatedAt: string; // ISO string
}

// ---- Mock data
const MOCK: EnvVar[] = [
  {
    id: '1',
    name: 'API_KEY',
    value: 'test',
    envs: ['development', 'preview', 'production'],
    visibility: 'plain',
    updatedAt: '2025-09-04T12:00:00Z',
  },
  {
    id: '2',
    name: 'SENTRY_DSN',
    value: 'https://****@sentry.io/123',
    envs: ['production'],
    visibility: 'secret',
    updatedAt: '2025-09-10T09:21:00Z',
  },
];

// ---- Helpers i18n
const getPreferredLocale = (p?: string | null) => {
  try {
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored === 'en' || stored === 'fr') return stored;
  } catch { }
  if (!p) return 'fr';
  const parts = p.split('/');
  const candidate = parts[1];
  if (candidate === 'en' || candidate === 'fr') return candidate;
  return 'fr';
};

export default function EnvPage() {
  // i18n
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [locale, setLocale] = useState(() => getPreferredLocale(pathname));
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const json = await getTranslations(locale);
      if (mounted) setTranslations(json);
    })();

    const onLocaleChanged = (e: any) => {
      const newLoc =
        e?.detail ??
        (typeof window !== 'undefined' ? localStorage.getItem('lang') : null);
      if (newLoc) setLocale(newLoc);
    };
    window.addEventListener('localeChanged', onLocaleChanged as EventListener);
    const onStorage = () => onLocaleChanged(null);
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      window.removeEventListener('localeChanged', onLocaleChanged as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [locale, pathname]);

  const t = (key: string) => {
    if (!translations) return key;
    const parts = key.split('.');
    let cur: any = translations;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
      else return key;
    }
    return typeof cur === 'string' ? cur : key;
  };

  // ---- Local state
  const [rows, setRows] = useState<EnvVar[]>(MOCK);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState<'all' | EnvName>('all');
  const [reveal, setReveal] = useState<Record<string, boolean>>({}); // id -> revealed

  // Dialog (add/edit)
  const [openDialog, setOpenDialog] = useState(false);
  const [draft, setDraft] = useState<EnvVar | null>(null);

  const visibleRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.value.toLowerCase().includes(search.toLowerCase());
      const matchesEnv =
        envFilter === 'all' ? true : r.envs.includes(envFilter);
      return matchesSearch && matchesEnv;
    });
  }, [rows, search, envFilter]);

  const allSelected = visibleRows.length > 0 && selected.length === visibleRows.length;
  const indeterminate = selected.length > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? visibleRows.map((r) => r.id) : []);
  };
  const toggleRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const envChip = (e: EnvName) => (
    <Chip
      key={e}
      size="small"
      label={e}
      sx={{
        textTransform: 'capitalize',
      }}
    />
  );

  const visibilityLabel = (v: Visibility) =>
    v === 'plain' ? 'Plain text' : 'Secret';

  const maskValue = (v: string) => (v.length <= 4 ? '••••' : '•'.repeat(Math.min(12, v.length)));

  const openAdd = () => {
    setDraft({
      id: crypto.randomUUID(),
      name: '',
      value: '',
      envs: [],
      visibility: 'plain',
      updatedAt: new Date().toISOString(),
    });
    setOpenDialog(true);
  };

  const openEdit = (row: EnvVar) => {
    setDraft({ ...row });
    setOpenDialog(true);
  };

  const saveDraft = () => {
    if (!draft) return;
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === draft.id);
      if (idx === -1) return [draft, ...prev];
      const copy = [...prev];
      copy[idx] = { ...draft, updatedAt: new Date().toISOString() };
      return copy;
    });
    setOpenDialog(false);
  };

  const exportSelected = () => {
    const out = rows.filter((r) => selected.includes(r.id));
    const json = JSON.stringify(out, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'env-variables.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteVariable = () => {
    if (!draft) return;
    setRows((prev) => prev.filter((r) => r.id !== draft.id));
    setOpenDialog(false);
  };

  return (
    <Box className="flex h-screen">
      <Menu />

      <Box
        className="flex-1 overflow-auto"
        sx={{ p: 6, bgcolor: 'background.default' }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {t('menu.environment_variables')}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              disabled={selected.length === 0}
              onClick={exportSelected}
            >
              {t('access_token.title')}
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={openAdd}
            >
              {t('project_page.add_variable')}
            </Button>
          </Stack>
        </Stack>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="env-filter-label">{t('project_page.environment')}</InputLabel>
              <Select
                labelId="env-filter-label"
                label={t('project_page.environment')}
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value as any)}
                size="small"
              >
                <MenuItem value="all">{t('common.all')}</MenuItem>
                <MenuItem value="development">development</MenuItem>
                <MenuItem value="preview">preview</MenuItem>
                <MenuItem value="production">production</MenuItem>
              </Select>
            </FormControl>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              placeholder={t('build_list.filter_placeholder')}
            />
          </Stack>
        </Paper>

        {/* Table */}
        <Paper className="rounded-xl shadow-sm">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell>{t('project_page.environment')}</TableCell>
                  <TableCell>{t('common.value')}</TableCell>
                  <TableCell>{t('access_token.status')}</TableCell>
                  <TableCell align="right">{t('project_page.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => {
                  const revealed = !!reveal[row.id];
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.2}>
                          <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(row.updatedAt).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {row.envs.map(envChip)}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">
                            {revealed ? row.value : maskValue(row.value)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setReveal((r) => ({ ...r, [row.id]: !revealed }))
                            }
                          >
                            {revealed ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {visibilityLabel(row.visibility)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small" onClick={() => openEdit(row)}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {t('build_list.no_builds')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialog add/edit */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {draft && rows.find((r) => r.id === draft.id)
              ? t('common.edit')
              : t('organization.add')}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                label={t('common.name')}
                value={draft?.name || ''}
                onChange={(e) => setDraft((d) => d && { ...d, name: e.target.value })}
                fullWidth
              />
              <TextField
                label={t('common.value')}
                value={draft?.value || ''}
                onChange={(e) => setDraft((d) => d && { ...d, value: e.target.value })}
                fullWidth
              />
              <FormControl>
                <InputLabel id="envs-label">{t('project_page.environment')}</InputLabel>
                <Select
                  labelId="envs-label"
                  multiple
                  input={<OutlinedInput label={t('project_page.environment')} />}
                  value={draft?.envs || []}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                  onChange={(e) =>
                    setDraft((d) => d && { ...d, envs: e.target.value as EnvName[] })
                  }
                >
                  {(['development', 'preview', 'production'] as EnvName[]).map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={draft?.envs.includes(name) || false} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="vis-label">Visibility</InputLabel>
                <Select
                  labelId="vis-label"
                  label="Visibility"
                  value={draft?.visibility || 'plain'}
                  onChange={(e) =>
                    setDraft((d) => d && { ...d, visibility: e.target.value as Visibility })
                  }
                >
                  <MenuItem value="plain">Plain text</MenuItem>
                  <MenuItem value="secret">Secret</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions>
            {/* Bouton supprimer visible uniquement en mode édition */}
            {draft && rows.find((r) => r.id === draft.id) && (
              <Button
                color="error"
                onClick={deleteVariable}
              >
                {t('common.delete')}
              </Button>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Button onClick={() => setOpenDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="contained" onClick={saveDraft}>
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}