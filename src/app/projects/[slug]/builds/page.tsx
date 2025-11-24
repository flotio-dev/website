'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Skeleton,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MUILink,
  Breadcrumbs,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';

import ProjectSubMenu from '../../../components/ProjectSubMenu';
import { getTranslations } from '../../../../lib/clientTranslations';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { useToast } from '../../../../lib/hooks/useToast';

// ---------- Types & mocks ----------

interface BuildItem {
  id: string;
  startedAt: string;
  finishedAt?: string;
  status: 'success' | 'failed' | 'running';
  description: string;
  platform?: string;
}

interface BuildSettings {
  provider: string;
  branch: string;
  buildCommand: string;
  outputDir: string;
  nodeVersion?: string;
}

interface Ownership {
  type: 'organization' | 'user';
  name: string;
}

interface ProjectShape {
  name: string;
  slug: string;
  urlPath: string;
  createdAt: string;
  lastActivityAt: string;
  lastActivityDescription: string;
  ownership: Ownership;
  buildSettings: BuildSettings;
  stats: {
    total: number;
    success: number;
    failed: number;
  };
  recentBuilds: BuildItem[];
}

const formatDate = (iso?: string, locale = 'fr') => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return iso;
  }
};

const mockProject: ProjectShape = {
  name: 'Test Project',
  slug: 'test-project',
  urlPath: '/build/test-project',
  createdAt: '2025-05-01T09:30:00Z',
  lastActivityAt: '2025-07-24T09:47:00Z',
  lastActivityDescription: 'Build #42 from main deployed to preview.',
  ownership: { type: 'organization', name: 'Acme Inc.' },
  buildSettings: {
    provider: 'Custom Runner',
    branch: 'main',
    buildCommand: 'pnpm build',
    outputDir: 'out',
    nodeVersion: '20',
  },
  stats: {
    total: 73,
    success: 66,
    failed: 5,
  },
  recentBuilds: [
    {
      id: 'build_0073',
      startedAt: '2025-07-24T09:30:00Z',
      finishedAt: '2025-07-24T09:47:00Z',
      status: 'success',
      description: 'Commit 9afc1e1 — Optimize images',
      platform: 'iOS',
    },
    {
      id: 'build_0072',
      startedAt: '2025-07-23T15:12:00Z',
      finishedAt: '2025-07-23T15:25:00Z',
      status: 'failed',
      description: 'Commit 1b23cde — Fix env var typo',
      platform: 'Android',
    },
    {
      id: 'build_0071',
      startedAt: '2025-07-22T11:05:00Z',
      status: 'running',
      description: 'Commit 7c3aa91 — Add analytics',
      platform: 'iOS',
    },
  ],
};

// ---------- Petits composants ----------

function StatusChip({
  status,
  t,
}: {
  status: BuildItem['status'];
  t: (key: string) => string;
}) {
  const map: Record<
    BuildItem['status'],
    { label: string; icon: React.ReactNode; color: 'success' | 'error' | 'default' }
  > = {
    success: {
      label: t('project_page.success'),
      icon: <CheckCircleIcon fontSize="small" />,
      color: 'success',
    },
    failed: {
      label: t('project_page.failed'),
      icon: <CancelIcon fontSize="small" />,
      color: 'error',
    },
    running: {
      label: t('project_page.running'),
      icon: <ScheduleIcon fontSize="small" />,
      color: 'default',
    },
  };
  const { label, icon, color } = map[status];
  return (
    <Chip
      icon={icon as any}
      label={label}
      color={color}
      variant={status === 'running' ? 'outlined' : 'filled'}
      size="small"
    />
  );
}

const getPreferredLocaleFromPath = (p?: string | null) => {
  if (!p) return 'fr';
  const parts = p.split('/');
  const candidate = parts[1];
  if (candidate === 'en' || candidate === 'fr') return candidate;
  return 'fr';
};

// ---------- Page principale ----------

export default function ProjectOverviewPage() {
  const pathname = usePathname() ?? '/';
  const params = useParams() as { slug?: string } | undefined;
  const [locale, setLocale] = useState<'en' | 'fr'>('fr');
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [projectData, setProjectData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

  const lastFailedSlugRef = useRef<string | null>(null);
  const lastFailedAtRef = useRef<number | null>(null);

  const { token } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // état du dialog "Start build"
  const [buildDialogOpen, setBuildDialogOpen] = useState(false);
  const [envTab, setEnvTab] = useState<'default' | 'production' | 'development' | 'preview'>('default');
  const [platform, setPlatform] = useState<'all' | 'android' | 'ios'>('all');
  const [autoSubmit, setAutoSubmit] = useState(false);

  // locale: valeur déterministe au SSR, puis mise à jour après hydration
  useEffect(() => {
    let next: 'en' | 'fr' = 'fr';

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'fr') {
        next = stored;
      } else {
        next = getPreferredLocaleFromPath(pathname) as 'en' | 'fr';
      }
    }

    setLocale(next);
  }, [pathname]);

  // translations
  useEffect(() => {
    let mounted = true;
    const load = async (loc: string) => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load(locale);
    return () => {
      mounted = false;
    };
  }, [locale]);

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

  // fetch projet
  useEffect(() => {
    let mounted = true;
    const idOrSlug =
      params?.slug ?? pathname.split('/').filter(Boolean).slice(-1)[0] ?? '';
    if (!idOrSlug) return;

    const cooldownMs = 60_000;
    if (
      lastFailedSlugRef.current === idOrSlug &&
      lastFailedAtRef.current &&
      Date.now() - lastFailedAtRef.current < cooldownMs
    ) {
      if (mounted) setNotFound(true);
      return;
    }

    const controller = new AbortController();

    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);
      setFetchErrorMessage(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          const msg = 'API base URL not configured (NEXT_PUBLIC_API_BASE_URL)';
          console.error(msg);
          if (mounted) {
            setFetchErrorMessage(msg);
            setNotFound(true);
            addToast({ message: msg, type: 'error' });
          }
          setLoading(false);
          return;
        }
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const url = `${base.replace(/\/$/, '')}/project/${idOrSlug}`;
        console.log('Fetching project from', url);
        const res = await fetch(url, { headers, signal: controller.signal });
        const data = await res.json().catch(() => null);

        if (res.status === 404) {
          if (mounted) {
            setNotFound(true);
            setFetchErrorMessage(
              data?.message ?? `Project "${idOrSlug}" not found`,
            );
            addToast({
              message: data?.message ?? `Project not found`,
              type: 'error',
            });
          }
          lastFailedSlugRef.current = idOrSlug;
          lastFailedAtRef.current = Date.now();
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const msg =
            data?.message || `Failed to fetch project (${res.status})`;
          throw new Error(msg);
        }

        const p = data?.project ?? data;
        if (mounted) {
          setProjectData(p);
          if (lastFailedSlugRef.current === idOrSlug) {
            lastFailedSlugRef.current = null;
            lastFailedAtRef.current = null;
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Failed to fetch project', err);
        if (mounted) {
          const msg = err?.message || 'Erreur lors du chargement du projet';
          setFetchErrorMessage(msg);
          setNotFound(true);
          addToast({ message: msg, type: 'error' });
          lastFailedSlugRef.current = idOrSlug;
          lastFailedAtRef.current = Date.now();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProject();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [pathname, token, addToast, params]);

  // slug pour le menu
  const pathParts = pathname.split('/').filter(Boolean);
  const candidateSlugFromPath = params?.slug ?? (pathParts[1] ?? pathParts[0]);
  const slugForMenu =
    (projectData && (projectData.id || (projectData as any).ID)
      ? String((projectData as any).ID ?? projectData.id)
      : candidateSlugFromPath) ?? 'project';

  // project fusion API + mocks
  const project: ProjectShape = useMemo(() => {
    if (projectData && projectData.name) {
      const pd: any = projectData;
      return {
        name: pd.name ?? mockProject.name,
        slug: pd.slug ?? pd.name ?? mockProject.slug,
        urlPath: pd.urlPath ?? `/build/${pd.slug ?? pd.name ?? 'project'}`,
        createdAt: (pd.CreatedAt ?? pd.createdAt ?? mockProject.createdAt) as string,
        lastActivityAt: (pd.UpdatedAt ?? pd.lastActivityAt ?? mockProject.lastActivityAt) as string,
        lastActivityDescription:
          pd.lastActivityDescription ?? mockProject.lastActivityDescription,
        ownership: {
          type: 'user',
          name: pd.user?.username ?? pd.user?.email ?? mockProject.ownership.name,
        },
        buildSettings: {
          provider: pd.build_provider ?? mockProject.buildSettings.provider,
          branch: pd.build_branch ?? mockProject.buildSettings.branch,
          buildCommand: pd.build_command ?? mockProject.buildSettings.buildCommand,
          outputDir: pd.build_folder ?? mockProject.buildSettings.outputDir,
          nodeVersion: pd.node_version ?? mockProject.buildSettings.nodeVersion,
        },
        stats: {
          total:
            (Array.isArray(pd.builds) ? pd.builds.length : undefined) ??
            mockProject.stats.total,
          success: mockProject.stats.success,
          failed: mockProject.stats.failed,
        },
        recentBuilds: mockProject.recentBuilds,
      };
    }
    const slug = candidateSlugFromPath ?? mockProject.slug;
    return { ...mockProject, slug };
  }, [projectData, candidateSlugFromPath]);

  const successRate = useMemo(() => {
    const denom = Math.max(1, project.stats.total);
    return Math.round((project.stats.success / denom) * 100);
  }, [project.stats]);

  // ---------- états loading / notFound ----------

  if (loading) {
    return (
      <Box className="flex h-screen">
        <ProjectSubMenu slug={slugForMenu} />
        <Box
          className="flex-1 overflow-auto"
          sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}
        >
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} />
          </Stack>
        </Box>
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box className="flex h-screen">
        <ProjectSubMenu slug={slugForMenu} />
        <Box
          className="flex-1 overflow-auto"
          sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                p: 2,
                bgcolor: 'background.paper',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                color="error"
                align="center"
              >
                {t('project_page.project_not_found') ?? 'Projet introuvable'}
              </Typography>
              <Typography
                color="text.primary"
                sx={{ mb: 2 }}
                align="center"
              >
                {fetchErrorMessage ?? `Le projet demandé n'a pas été trouvé.`}
              </Typography>
              <Stack spacing={2} alignItems="center" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/projects')}
                >
                  {t('project_page.back_to_projects') ??
                    'Retour à la liste des projets'}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  }

  // ---------- UI principale (sans "Edit project") ----------

  return (
    <Box className="flex h-screen">
      <ProjectSubMenu slug={slugForMenu} />

      <Box
        className="flex-1 overflow-auto"
        sx={{ p: 6, bgcolor: 'background.default' }}
      >
        {/* Header */}
        <Box className="flex justify-between items-start mb-6">
          <Stack spacing={1}>
            <Breadcrumbs aria-label="breadcrumb">
              <MUILink underline="hover" color="inherit" href="/projects">
                {t('project_page.projects')}
              </MUILink>
              <Typography color="text.primary">{project.name}</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                {project.name[0]}
              </Avatar>
              <div>
                <Typography
                  variant="h4"
                  className="font-bold"
                  color="text.primary"
                >
                  {project.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    color="default"
                    label={
                      project.ownership.type === 'organization'
                        ? `${t('project_page.organization')} : ${project.ownership.name}`
                        : `${t('project_page.user')} : ${project.ownership.name}`
                    }
                  />
                  <Chip
                    size="small"
                    color="default"
                    label={`${t('project_page.created_at')} ${formatDate(
                      project.createdAt,
                      locale,
                    )}`}
                  />
                </Stack>
              </div>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={() => setBuildDialogOpen(true)}
            >
              {t('project_page.start_build')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
            >
              {t('project_page.download_apk') ?? 'Download APK'}
            </Button>
          </Stack>
        </Box>

        {/* Overview + Build settings */}
        <Grid container spacing={2}>
          <Card
            sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper' }}
          >
            <CardContent>
              <Typography variant="h6" color="text.primary">
                {t('project_page.overview')}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Paper className="rounded-xl" sx={{ p: 2 }}>
                  <Typography variant="overline">
                    {t('project_page.total_builds')}
                  </Typography>
                  <Typography variant="h5">
                    {project.stats.total}
                  </Typography>
                </Paper>
                <Paper className="rounded-xl" sx={{ p: 2 }}>
                  <Typography variant="overline">
                    {t('project_page.success')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon fontSize="small" />
                    <Typography variant="h5">
                      {project.stats.success}
                    </Typography>
                    <Chip
                      size="small"
                      color="default"
                      label={`${successRate}%`}
                    />
                  </Stack>
                </Paper>
                <Paper className="rounded-xl" sx={{ p: 2 }}>
                  <Typography variant="overline">
                    {t('project_page.failed')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CancelIcon fontSize="small" />
                    <Typography variant="h5">
                      {project.stats.failed}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">
                {t('project_page.last_activity_description')}
              </Typography>
              <Typography variant="body1">
                {project.lastActivityDescription}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {t('project_page.build_settings')}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('project_page.provider')}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>
                    {project.buildSettings.provider}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('project_page.branch')}
                  </Typography>
                  <Typography>{project.buildSettings.branch}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('project_page.command')}
                  </Typography>
                  <Typography>{project.buildSettings.buildCommand}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('project_page.output_dir')}
                  </Typography>
                  <Typography>{project.buildSettings.outputDir}</Typography>
                </Stack>
                {project.buildSettings.nodeVersion && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Node</Typography>
                    <Typography>{project.buildSettings.nodeVersion}</Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent builds */}
        <Box mt={3}>
          <Paper className="rounded-xl shadow-sm" sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" color="text.primary">
                {t('project_page.builds')}
              </Typography>
              <Button size="small" href={`/projects/${project.slug}/builds`}>
                {t('project_page.view_all')}
              </Button>
            </Stack>
            {project.recentBuilds.length === 0 ? (
              <Typography color="text.secondary">
                {t('project_page.no_builds_yet')}
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>{t('project_page.status')}</TableCell>
                      <TableCell>{t('project_page.start')}</TableCell>
                      <TableCell>{t('project_page.end')}</TableCell>
                      <TableCell>{t('project_page.description')}</TableCell>
                      <TableCell>{t('project_page.platform')}</TableCell>
                      <TableCell align="right">
                        {t('project_page.actions')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {project.recentBuilds.map((b) => (
                      <TableRow
                        key={b.id}
                        hover
                        sx={{
                          '&:nth-of-type(odd) td': {
                            bgcolor: 'background.paper',
                          },
                          '&:nth-of-type(even) td': {
                            bgcolor: 'background.default',
                          },
                          '&:hover td': { bgcolor: 'action.hover' },
                          transition: 'background-color 120ms ease',
                        }}
                      >
                        <TableCell>
                          <MUILink
                            href={`/projects/${project.slug}/builds`}
                            underline="none"
                          >
                            {b.id}
                          </MUILink>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={b.status} t={t} />
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary">
                            {formatDate(b.startedAt, locale)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {b.finishedAt
                            ? formatDate(b.finishedAt, locale)
                            : '—'}
                        </TableCell>
                        <TableCell>{b.description}</TableCell>
                        <TableCell>{b.platform}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>

        {/* Start build dialog */}
        <Dialog
          open={buildDialogOpen}
          onClose={() => setBuildDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{t('project_page.start_build') ?? 'Start build'}</DialogTitle>

          <DialogContent dividers>
            {/* Environment */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('project_page.environment') ?? 'Environment'}
            </Typography>

            <Tabs
              value={envTab}
              onChange={(_, v) => setEnvTab(v)}
              sx={{ mb: 2 }}
              variant="fullWidth"
            >
              <Tab value="default" label={t('project_page.env_default') ?? 'Default'} />
              <Tab value="production" label={t('project_page.env_production') ?? 'Production'} />
              <Tab value="development" label={t('project_page.env_development') ?? 'Development'} />
              <Tab value="preview" label={t('project_page.env_preview') ?? 'Preview'} />
            </Tabs>

            <FormControlLabel
              control={
                <Checkbox
                  checked={autoSubmit}
                  onChange={(_, checked) => setAutoSubmit(checked)}
                />
              }
              label={
                t('project_page.auto_submit') ??
                'Automatically submit to stores after building successfully'
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label={t('project_page.eas_submit_profile') ?? 'EAS Submit profile'}
              fullWidth
              size="small"
              margin="dense"
              defaultValue="production"
            />

            <Divider sx={{ my: 3 }} />

            {/* Repo & build settings */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('project_page.build_config') ?? 'Build configuration'}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label={t('project_page.base_directory') ?? 'Base directory'}
                fullWidth
                size="small"
                defaultValue="/"
              />

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('project_page.platform') ?? 'Platform'}
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={platform}
                  onChange={(_, v) => v && setPlatform(v)}
                  size="small"
                >
                  <ToggleButton value="all">
                    {t('project_page.platform_all') ?? 'All'}
                  </ToggleButton>
                  <ToggleButton value="android">
                    {t('project_page.platform_android') ?? 'Android'}
                  </ToggleButton>
                  <ToggleButton value="ios">
                    {t('project_page.platform_ios') ?? 'iOS'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <TextField
                label={t('project_page.git_ref') ?? 'Git ref'}
                helperText={t('project_page.git_ref_help') ?? 'Commit hash, branch, or tag'}
                fullWidth
                size="small"
                defaultValue="main"
              />

              <TextField
                label={t('project_page.eas_build_profile') ?? 'EAS Build profile'}
                fullWidth
                size="small"
                defaultValue="production"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setBuildDialogOpen(false)}>
              {t('project_page.cancel') ?? 'Cancel'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // TODO: lancer la requête de build ici
                setBuildDialogOpen(false);
              }}
            >
              {t('project_page.start_build') ?? 'Start build'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
