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
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';

import ProjectSubMenu from '@/app/components/ProjectSubMenu';
import { getTranslations } from '@/lib/clientTranslations';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import clientApi, { clientApiRaw } from '@/lib/utils';

// ---------- Types ----------

// Type correspondant à la réponse API /projects/{id}/builds
interface ApiBuild {
  id: number;
  created_at: string;
  updated_at: string;
  project_id: number;
  status: string;
  platform: string;
  container_id: string;
  duration: number;
  apk_url: string;
}

interface BuildsResponse {
  builds: ApiBuild[];
}

// Type pour la requête de création de build POST /project/{id}/build
interface BuildRequest {
  platform?: string;
  build_mode?: string;
  build_target?: string;
  flutter_channel?: string;
  git_branch?: string;
  git_username?: string;
  git_token?: string;
}

interface BuildResponse {
  build: ApiBuild;
}

interface BuildItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'success' | 'failed' | 'running' | 'pending' | 'cancelled' | string;
  platform: string;
  duration: number;
  apkUrl: string;
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
  //lastActivityDescription: string;
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
    { label: string; icon: React.ReactNode; color: 'success' | 'error' | 'default' | 'warning' | 'primary' }
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
      color: 'primary',
    },
    pending: {
      label: t('project_page.pending') ?? 'Pending',
      icon: <ScheduleIcon fontSize="small" />,
      color: 'warning',
    },
    cancelled: {
      label: t('project_page.cancelled') ?? 'Cancelled',
      icon: <CancelIcon fontSize="small" />,
      color: 'default',
    },
  };
  const config = map[status] ?? map.pending;
  const { label, icon, color } = config;
  return (
    <Chip
      icon={icon as any}
      label={label}
      color={color}
      variant={status === 'running' || status === 'pending' ? 'outlined' : 'filled'}
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
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(false);
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
  const [platform, setPlatform] = useState<'all' | 'android'>('all');
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [startingBuild, setStartingBuild] = useState(false);

  // états du formulaire de build
  const [buildMode, setBuildMode] = useState<'release' | 'debug'>('release');
  const [buildTarget, setBuildTarget] = useState<'apk' | 'aab'>('apk');
  const [flutterChannel, setFlutterChannel] = useState<'stable' | 'beta' | 'master'>('stable');
  const [gitBranch, setGitBranch] = useState('main');

  // état du téléchargement APK
  const [downloadingApk, setDownloadingApk] = useState(false);

  // Fonction pour télécharger l'APK
  const handleDownloadApk = async (buildId?: string) => {
    console.log('handleDownloadApk called with buildId:', buildId);
    console.log('projectData:', projectData);
    console.log('builds:', builds);

    const projectId = projectData?.id ?? projectData?.ID;
    console.log('projectId:', projectId);

    if (!projectId) {
      addToast({ message: t('project_page.no_project_id') ?? 'Project ID not found', type: 'error' });
      return;
    }

    // Si pas de buildId fourni, utiliser le dernier build successful
    const targetBuildId = buildId ?? builds.find((b) => b.status === 'success')?.id;
    console.log('targetBuildId:', targetBuildId);

    if (!targetBuildId) {
      addToast({ message: t('project_page.no_build_available') ?? 'No build available for download', type: 'error' });
      return;
    }

    setDownloadingApk(true);
    try {
      interface DownloadResponse {
        download_url: string;
        artifact_key: string;
        expires_in: string;
      }

      const url = `project/${projectId}/build/${targetBuildId}/download`;
      console.log('Calling API:', url);

      const data = await clientApi<DownloadResponse>(url);
      console.log('API response:', data);

      if (!data.download_url) {
        throw new Error('No download URL in response');
      }

      // Ouvrir l'URL de téléchargement dans un nouvel onglet
      window.open(data.download_url, '_blank');

      addToast({ message: t('project_page.download_started') ?? 'Download started', type: 'success' });
    } catch (err: any) {
      console.error('Failed to download APK', err);
      addToast({ message: err?.message ?? t('project_page.download_failed') ?? 'Download failed', type: 'error' });
    } finally {
      setDownloadingApk(false);
    }
  };

  // Fonction pour lancer un build
  const handleStartBuild = async () => {
    const projectId = projectData?.id ?? projectData?.ID;
    if (!projectId) {
      addToast({ message: t('project_page.no_project_id') ?? 'Project ID not found', type: 'error' });
      return;
    }

    setStartingBuild(true);
    try {
      const platforms = platform === 'all' ? ['android'] : [platform];

      for (const p of platforms) {
        const requestBody: BuildRequest = {
          platform: p,
          build_mode: buildMode,
          build_target: buildTarget,
          flutter_channel: flutterChannel,
          git_branch: gitBranch,
        };

        const data = await clientApi<BuildResponse>(`project/${projectId}/build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (data.build) {
          // Ajouter le nouveau build à la liste
          const newBuild: BuildItem = {
            id: String(data.build.id),
            createdAt: data.build.created_at,
            updatedAt: data.build.updated_at,
            status: data.build.status as BuildItem['status'],
            platform: data.build.platform,
            duration: data.build.duration,
            apkUrl: data.build.apk_url,
          };
          setBuilds((prev) => [newBuild, ...prev]);
        }
      }

      addToast({ message: t('project_page.build_started') ?? 'Build started successfully', type: 'success' });
      setBuildDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to start build', err);
      addToast({ message: err?.message ?? t('project_page.build_start_failed') ?? 'Failed to start build', type: 'error' });
    } finally {
      setStartingBuild(false);
    }
  };

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBuildId, setDeleteBuildId] = useState<string | null>(null);
  const [deletingBuild, setDeletingBuild] = useState(false);

  const openDeleteDialog = (id: string) => {
    setDeleteBuildId(id);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteBuildId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    const id = deleteBuildId;
    if (!id) return;

    const projectId = projectData?.id ?? projectData?.ID;
    if (!projectId) {
      addToast({ message: t('project_page.no_project_id') ?? 'Project ID not found', type: 'error' });
      return;
    }

    setDeletingBuild(true);
    try {
      const res = await clientApiRaw(`project/${projectId}/build/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to delete build (${res.status})`);
      }

      // remove build from local state
      setBuilds((prev) => prev.filter((b) => b.id !== id));
      addToast({ message: t('project_page.build_deleted') ?? 'Build deleted', type: 'success' });
      closeDeleteDialog();
    } catch (err: any) {
      console.error('Failed to delete build', err);
      addToast({ message: err?.message ?? t('project_page.build_delete_failed') ?? 'Failed to delete build', type: 'error' });
    } finally {
      setDeletingBuild(false);
    }
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
        console.log('Fetching project', idOrSlug);
        const res = await clientApiRaw(`project/${idOrSlug}`, { signal: controller.signal });
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

  // Fetch builds depuis l'API /projects/{id}/builds
  useEffect(() => {
    const projectId = projectData?.id ?? projectData?.ID;
    if (!projectId) return;

    let mounted = true;

    const fetchBuilds = async () => {
      setBuildsLoading(true);
      try {
        const data = await clientApi<BuildsResponse>(`project/${projectId}/builds`);

        if (mounted && data.builds) {
          const mappedBuilds: BuildItem[] = data.builds.map((b) => ({
            id: String(b.id),
            createdAt: b.created_at,
            updatedAt: b.updated_at,
            status: b.status as BuildItem['status'],
            platform: b.platform,
            duration: b.duration,
            apkUrl: b.apk_url,
          }));
          setBuilds(mappedBuilds);
        }
      } catch (err: any) {
        console.error('Failed to fetch builds', err);
        // Ne pas afficher de toast pour les builds, on affiche juste une liste vide
      } finally {
        if (mounted) setBuildsLoading(false);
      }
    };

    fetchBuilds();
    return () => {
      mounted = false;
    };
  }, [projectData]);

  // slug pour le menu
  const pathParts = pathname.split('/').filter(Boolean);
  const candidateSlugFromPath = params?.slug ?? (pathParts[1] ?? pathParts[0]);
  const slugForMenu =
    (projectData && (projectData.id || (projectData as any).ID)
      ? String((projectData as any).ID ?? projectData.id)
      : candidateSlugFromPath) ?? 'project';

  // project depuis l'API
  const project: ProjectShape | null = useMemo(() => {
    if (!projectData || !projectData.name) return null;

    const pd: any = projectData;
    const successCount = builds.filter((b) => b.status === 'success').length;
    const failedCount = builds.filter((b) => b.status === 'failed').length;

    return {
      name: pd.name,
      slug: pd.slug ?? pd.name ?? candidateSlugFromPath ?? '',
      urlPath: pd.urlPath ?? `/build/${pd.slug ?? pd.name ?? 'project'}`,
      createdAt: (pd.created_at ?? pd.CreatedAt ?? pd.createdAt ?? '') as string,
      lastActivityAt: (pd.updated_at ?? pd.UpdatedAt ?? pd.lastActivityAt ?? '') as string,
      lastActivityDescription: pd.lastActivityDescription ?? '',
      ownership: {
        type: 'user' as const,
        name: pd.user?.username ?? pd.user?.email ?? '',
      },
      buildSettings: {
        provider: pd.build_provider ?? '',
        branch: pd.build_branch ?? 'main',
        buildCommand: pd.build_command ?? '',
        outputDir: pd.build_folder ?? '',
        nodeVersion: pd.node_version,
      },
      stats: {
        total: builds.length,
        success: successCount,
        failed: failedCount,
      },
      recentBuilds: builds.slice(0, 5),
    };
  }, [projectData, candidateSlugFromPath, builds]);

  const successRate = useMemo(() => {
    if (!project) return 0;
    const denom = Math.max(1, project.stats.total);
    return Math.round((project.stats.success / denom) * 100);
  }, [project]);

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

  // Si pas de données projet après chargement
  if (!project) {
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

  // ---------- UI principale ----------

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
                <Chip
                  size="small"
                  color="default"
                  label={`${t('project_page.created_at')} ${formatDate(
                    project.createdAt,
                    locale,
                  )}`}
                />
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
              startIcon={downloadingApk ? <CircularProgress size={20} /> : <DownloadIcon />}
              onClick={() => handleDownloadApk()}
              disabled={downloadingApk}
            >
              {downloadingApk
                ? (t('project_page.downloading') ?? 'Downloading...')
                : (t('project_page.download_apk') ?? 'Download APK')}
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
                    {t('project_page.branch')}
                  </Typography>
                  <Typography>{project.buildSettings.branch}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t('project_page.output_dir')}
                  </Typography>
                  <Typography>{project.buildSettings.outputDir}</Typography>
                </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Channel</Typography>
                    <Typography>{project.buildSettings.nodeVersion}</Typography>
                  </Stack>
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
              <Button size="small" href={`/projects/${slugForMenu}/builds/builds-view-all`}>
                {t('project_page.view_all')}
              </Button>
            </Stack>
            {buildsLoading ? (
              <Stack spacing={1}>
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={40} />
              </Stack>
            ) : builds.length === 0 ? (
              <Typography color="text.secondary">
                {t('project_page.no_builds_yet')}
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>{t('project_page.status')}</TableCell>
                        <TableCell>{t('project_page.created_at')}</TableCell>
                        <TableCell>{t('project_page.duration')}</TableCell>
                        <TableCell>{t('project_page.platform')}</TableCell>
                        <TableCell align="right">
                          {t('project_page.actions')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {builds.slice(0, 5).map((b: BuildItem, i: number) => (
                        <TableRow
                          key={`${b.id}-${i}`}
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
                              href={`/projects/${slugForMenu}/builds/${b.id}`}
                              underline="none"
                            >
                              #{b.id}
                            </MUILink>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={b.status} t={t} />
                          </TableCell>
                          <TableCell>
                            <Typography color="text.secondary">
                              {formatDate(b.createdAt, locale)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {b.duration > 0 ? `${Math.round(b.duration / 60)}min` : '—'}
                          </TableCell>
                          <TableCell>{b.platform}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              {b.status === 'success' && (
                                <Tooltip title={t('project_page.download_apk') ?? 'Download APK'}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDownloadApk(b.id)}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <IconButton size="small" onClick={() => openDeleteDialog(b.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Dialog
                  open={deleteDialogOpen}
                  onClose={() => !deletingBuild && closeDeleteDialog()}
                >
                  <DialogTitle>{t('project_page.delete_build') ?? 'Delete build'}</DialogTitle>
                  <DialogContent dividers>
                    <Typography>
                      {t('project_page.delete_build_confirm') ?? 'Are you sure you want to delete this build? This action cannot be undone.'}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeDeleteDialog} disabled={deletingBuild}>
                      {t('project_page.cancel') ?? 'Cancel'}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleConfirmDelete}
                      disabled={deletingBuild}
                      startIcon={deletingBuild ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                      {t('project_page.delete') ?? 'Delete'}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Paper>
        </Box>

        {/* Start build dialog */}
        <Dialog
          open={buildDialogOpen}
          onClose={() => !startingBuild && setBuildDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{t('project_page.start_build') ?? 'Start build'}</DialogTitle>

          <DialogContent dividers>
            {/* Platform selection */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('project_page.platform') ?? 'Platform'}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={platform}
              onChange={(_, v) => v && setPlatform(v)}
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="all">
                {t('project_page.platform_all') ?? 'All'}
              </ToggleButton>
              <ToggleButton value="android">
                {t('project_page.platform_android') ?? 'Android'}
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider sx={{ my: 2 }} />

            {/* Build mode */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('project_page.build_mode') ?? 'Build mode'}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={buildMode}
              onChange={(_, v) => v && setBuildMode(v)}
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="release">Release</ToggleButton>
              <ToggleButton value="debug">Debug</ToggleButton>
            </ToggleButtonGroup>

            {/* Build target (Android only) */}
            {(platform === 'android' || platform === 'all') && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {t('project_page.build_target') ?? 'Build target'}
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={buildTarget}
                  onChange={(_, v) => v && setBuildTarget(v)}
                  size="small"
                  sx={{ mb: 3 }}
                >
                  <ToggleButton value="apk">APK</ToggleButton>
                  <ToggleButton value="aab">AAB (App Bundle)</ToggleButton>
                </ToggleButtonGroup>
              </>
            )}

            {/* Flutter channel */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('project_page.flutter_channel') ?? 'Flutter channel'}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={flutterChannel}
              onChange={(_, v) => v && setFlutterChannel(v)}
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="stable">Stable</ToggleButton>
              <ToggleButton value="beta">Beta</ToggleButton>
              <ToggleButton value="master">Master</ToggleButton>
            </ToggleButtonGroup>

            <Divider sx={{ my: 2 }} />

            {/* Git branch */}
            <TextField
              label={t('project_page.git_branch') ?? 'Git branch'}
              fullWidth
              size="small"
              value={gitBranch}
              onChange={(e) => setGitBranch(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setBuildDialogOpen(false)} disabled={startingBuild}>
              {t('project_page.cancel') ?? 'Cancel'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartBuild}
              disabled={startingBuild}
              startIcon={startingBuild ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              {startingBuild
                ? (t('project_page.starting_build') ?? 'Starting...')
                : (t('project_page.start_build') ?? 'Start build')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
