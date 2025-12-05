'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Paper, Grid, Typography, Avatar, Stack, Chip, Divider, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Switch, FormControlLabel, Select, MenuItem } from '@mui/material';
import ProjectSubMenu from '@/app/components/ProjectSubMenu';
import { getTranslations } from '@/lib/clientTranslations';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import clientApi, { clientApiRaw } from '@/lib/utils';
import { Root } from '@/lib/types/github.repos';

interface Ownership {
  type: 'organization' | 'user';
  name: string;
}

interface BuildSettings {
  outputDir?: string;
}

interface ProjectShape {
  name: string;
  slug: string;
  id?: number | string;
  created_at?: string;
  updated_at?: string;
  ownership?: Ownership;
  buildSettings?: BuildSettings;
  // optional fields that might exist on the API
  git_repository?: string;
  git_repo?: string;
  build_folder?: string;
  flutter_version?: string;
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

const getPreferredLocale = (p?: string | null) => {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored === 'en' || stored === 'fr') return stored;
  } catch { }
  if (!p) return 'fr';
  const parts = p.split('/');
  const candidate = parts[1];
  if (candidate === 'en' || candidate === 'fr') return candidate;
  return 'fr';
};


export default function ProjectOverviewPage() {
  const pathname = usePathname() ?? '/';
  const params = useParams() as { slug?: string } | undefined;
  const [locale, setLocale] = useState(() => getPreferredLocale(pathname));
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [projectData, setProjectData] = useState<ProjectShape | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  // ref to avoid repeated fetches for the same missing slug (cooldown)
  const lastFailedSlugRef = useRef<string | null>(null);
  const lastFailedAtRef = useRef<number | null>(null);
  const { token } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  // edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGitRepo, setEditGitRepo] = useState('');
  const [editBuildFolder, setEditBuildFolder] = useState('');
  const [editFlutterVersion, setEditFlutterVersion] = useState('');
  const [editGithubConnected, setEditGithubConnected] = useState<boolean | null>(null);
  const [editRepo, setEditRepo] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [repos, setRepos] = useState<Array<any>>([]);
  const [reposLoading, setReposLoading] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    const idOrSlug = params?.slug ?? pathname.split('/').filter(Boolean).slice(-1)[0] ?? '';
    if (!idOrSlug) return;

    // if we recently failed for this slug and cooldown not passed, skip fetching to avoid loops
    const cooldownMs = 60_000; // 60s
    if (lastFailedSlugRef.current === idOrSlug && lastFailedAtRef.current && Date.now() - lastFailedAtRef.current < cooldownMs) {
      // indicate notFound so UI shows the framed message without triggering more fetches
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
            setFetchErrorMessage(data?.message ?? `Project "${idOrSlug}" not found`);
            addToast({ message: data?.message ?? `Project not found`, type: 'error' });
          }
          // remember failed slug to avoid refetch storms
          lastFailedSlugRef.current = idOrSlug;
          lastFailedAtRef.current = Date.now();
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const msg = data?.message || `Failed to fetch project (${res.status})`;
          throw new Error(msg);
        }
        const p = data?.project ?? data;
        if (mounted) {
          setProjectData(p);
          // clear previous failure record on success
          if (lastFailedSlugRef.current === idOrSlug) {
            lastFailedSlugRef.current = null;
            lastFailedAtRef.current = null;
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // aborted, don't treat as an error
          return;
        }
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

  // Fetch GitHub repos when edit dialog opens and GitHub is connected
  useEffect(() => {
    let mounted = true;
    const fetchRepos = async () => {
      if (!editOpen) return;
      if (!editGithubConnected) return;
      try {
        setReposLoading(true);
        const data = await clientApi<Root>('github/repos');
        if (!mounted) return;
        setRepos(data?.details?.repositories || []);
      } catch (err: any) {
        console.error('Failed to fetch GitHub repos', err);
        if (!mounted) return;
        setRepos([]);
        addToast({ message: t('add_project.errors.fetch_repos') || 'Failed to fetch repositories', type: 'error' });
      } finally {
        if (mounted) setReposLoading(false);
      }
    };

    fetchRepos();

    return () => {
      mounted = false;
    };
  }, [editOpen, editGithubConnected]);

  // split path early so we can build sensible defaults without using mock data
  const pathParts = pathname.split('/').filter(Boolean);
  // Prefer the route param or the last path segment as a candidate slug
  const candidateSlugFromPath = params?.slug ?? (pathParts[1] ?? pathParts[0]);

  const project = useMemo<ProjectShape>(() => {
    if (projectData && projectData.name) {
      // Normalize API shape (API returns created_at / UpdatedAt and nested user)
      const pd: any = projectData;
      return {
        name: pd.name,
        slug: pd.slug ?? pd.name,
        id: pd.ID ?? pd.id ?? undefined,
        created_at: (pd.created_at ?? pd.created_at) as string | undefined,
        updated_at: (pd.UpdatedAt ?? pd.updated_at) as string | undefined,
        ownership: pd.user ? { type: 'user', name: pd.user.username ?? pd.user.email ?? '' } : undefined,
        buildSettings: { outputDir: pd.build_folder ?? undefined },
        git_repo: pd.git_repo ?? pd.git_repository,
        build_folder: pd.build_folder,
        flutter_version: pd.flutter_version,
      } as ProjectShape;
    }

    // No API data yet — return a minimal empty shape (no mock placeholders)
    return {
      name: '',
      slug: candidateSlugFromPath ?? '',
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
      ownership: undefined,
      buildSettings: {},
    } as ProjectShape;
  }, [projectData, candidateSlugFromPath]);

  // Logs state: fetched lazily for this project
  const [logs, setLogs] = useState<string[] | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const fetchLogs = async (slugOrId?: string) => {
    const id = slugOrId ?? candidateSlugFromPath ?? project.slug ?? '';
    if (!id) return;
    setLogsLoading(true);
    setLogsError(null);
    try {
      const res = await clientApiRaw(`project/${id}/logs`);
      if (res.status === 404) {
        setLogs([]);
        setLogsLoading(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to fetch logs (${res.status})`);
      }
      const data = await res.json().catch(() => null);
      const items: string[] = Array.isArray(data) ? data : data?.logs ?? [];
      setLogs(items.map((l) => String(l)));
    } catch (err: any) {
      console.error('Failed to fetch logs', err);
      setLogsError(err?.message ?? 'Erreur lors du chargement des logs');
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  // fetch logs when we have a slug (but don't block the main project rendering)
  useEffect(() => {
    let mounted = true;
    if (!candidateSlugFromPath) return;
    // small timeout to avoid racing with project fetch
    const t = setTimeout(() => {
      if (!mounted) return;
      fetchLogs(candidateSlugFromPath);
    }, 300);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [candidateSlugFromPath, token]);

  // Save edits to project
  const handleSaveEdit = async () => {
    const id = project.id ?? candidateSlugFromPath ?? project.slug ?? '';
    if (!id) {
      addToast({ message: 'Project identifier missing', type: 'error' });
      return;
    }
    setEditSaving(true);
    try {
      const gitRepoToSend = editGithubConnected ? (editRepo || editGitRepo) : editGitRepo;
      const payload = {
        name: editName,
        git_repo: gitRepoToSend,
        build_folder: editBuildFolder,
        flutter_version: editFlutterVersion,
      };

      const data = await clientApi<any>(`project/${encodeURIComponent(String(id))}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const p = data?.project ?? data;
      setProjectData(p);
      addToast({ message: t('add_project.notifications.updated') ?? 'Project mis à jour', type: 'success' });
      setEditOpen(false);
    } catch (err: any) {
      console.error('Failed to save project', err);
      addToast({ message: err?.message || 'Erreur lors de la mise à jour', type: 'error' });
    } finally {
      setEditSaving(false);
    }
  };

  // determine a slug for building menu links
  const slugForMenu = project.id ? String(project.id) : candidateSlugFromPath ?? project.slug ?? 'project';
  // If loading, show skeletons
  if (loading) {
    return (
      <Box className="flex h-screen">
        <ProjectSubMenu slug={slugForMenu} />
        <Box className="flex-1 overflow-auto" sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} />
          </Stack>
        </Box>
      </Box>
    );
  }

  // If not found or fetch error, show a friendly framed message instead of bubbling raw errors
  if (notFound) {
    return (
      <Box className="flex h-screen">
        <ProjectSubMenu slug={slugForMenu} />
        <Box className="flex-1 overflow-auto" sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom color="error" align="center">
                {t('project_page.project_not_found') ?? 'Projet introuvable'}
              </Typography>
              <Typography color="text.primary" sx={{ mb: 2 }} align="center">
                {fetchErrorMessage ?? `Le projet demandé n'a pas été trouvé.`}
              </Typography>
              <Stack spacing={2} alignItems="center" justifyContent="center">
                <Button variant="contained" color="primary" onClick={() => router.push('/projects')}>
                  {t('project_page.back_to_projects') ?? 'Retour à la liste des projets'}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex h-screen">
      <ProjectSubMenu slug={slugForMenu} />
      <Box className="flex-1 overflow-auto" sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 72, height: 72, fontSize: 28 }}>
              {project.name?.[0] ?? '?'}
            </Avatar>
            <Box>
              <Typography variant="h4" className="font-bold" color="text.primary">
                {project.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={`Version: ${projectData?.flutter_version ?? project.flutter_version ?? '—'}`}
                  sx={{ ml: 1 }}
                />
              </Stack>
            </Box>
          </Stack>

          <Box>
            <Button variant="outlined" onClick={() => {
              // prepare dialog values
              setEditName(project.name ?? '');
              const existingGit = (projectData?.git_repo ?? projectData?.git_repository ?? '') as string;
              setEditGitRepo(existingGit);
              setEditRepo(existingGit);
              setEditGithubConnected(!!existingGit);
              setEditBuildFolder((projectData?.build_folder ?? project.buildSettings?.outputDir ?? '') as string);
              setEditFlutterVersion((projectData?.flutter_version ?? project.flutter_version ?? '') as string);
              setEditOpen(true);
            }}>
              Edit
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Box sx={{ width: '100%' }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', mb: 4 }}>
              <Typography variant="h6" gutterBottom color="text.primary">{t('project_page.overview')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography color="text.primary"><strong>{t('project_page.name')}: </strong>{project.name}</Typography>
                <Typography color="text.primary"><strong>Slug: </strong>{project.slug}</Typography>
                <Typography color="text.primary"><strong>{t('project_page.created_at')}: </strong>{formatDate(project.created_at, locale)}</Typography>
                <Typography color="text.primary"><strong>{t('project_page.updated_at')}: </strong>{formatDate(project.updated_at, locale)}</Typography>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper', mb: 4 }}>
              <Typography variant="h6" gutterBottom color="text.primary">{t('project_page.build_settings')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Typography color="text.primary">
                  <strong>Git repo: </strong>
                  {projectData?.git_repository ?? projectData?.git_repo ? (
                    <Link href={projectData?.git_repository ?? projectData?.git_repo ?? '#'} target="_blank" rel="noopener noreferrer">
                      {(projectData?.git_repository ?? projectData?.git_repo) as string}
                    </Link>
                  ) : (
                    '—'
                  )}
                </Typography>
                <Typography color="text.primary"><strong>{t('project_page.build_folder')}: </strong>{project.buildSettings?.outputDir ?? projectData?.build_folder ?? '—'}</Typography>
                <Typography color="text.primary"><strong>{t('project_page.flutter_version')}: </strong>{projectData?.flutter_version ?? '—'}</Typography>
              </Stack>
            </Paper>
          </Box>
        </Grid>
        {/* Edit Project Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{t('project_page.edit_project') ?? 'Edit project'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label={t('add_project.fields.project_name') ?? 'Name'} value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
              {/* Choisir le dépôt */}
              <Typography variant="subtitle2" sx={{ mt: 1 }}>{t('add_project.steps.repo') ?? 'Choisir le dépôt'}</Typography>
              {editGithubConnected ? (
                <Select value={editRepo} onChange={(e) => setEditRepo(String(e.target.value))} fullWidth>
                  <MenuItem value="">{`-- ${t('add_project.fields.repo') || 'Select repo'} --`}</MenuItem>
                  {reposLoading ? (
                    <MenuItem value="" disabled>{t('add_project.messages.checking_github') || 'Loading...'}</MenuItem>
                  ) : repos.length === 0 ? (
                    <MenuItem value="" disabled>{t('add_project.messages.no_repos') || 'No repositories found'}</MenuItem>
                  ) : (
                    repos.map((r: any) => (
                      <MenuItem key={r.id ?? r.full_name} value={r.full_name}>
                        {r.full_name}{r.private ? ' (private)' : ''}
                      </MenuItem>
                    ))
                  )}
                </Select>
              ) : (
                <TextField label={t('project_page.git_repo') ?? 'Git repository'} value={editGitRepo} onChange={(e) => setEditGitRepo(e.target.value)} fullWidth />
              )}

              <TextField label={t('add_project.fields.build_path') ?? 'Dossier de build'} value={editBuildFolder} onChange={(e) => setEditBuildFolder(e.target.value)} fullWidth />

              <Typography variant="subtitle2" sx={{ mt: 1 }}>{t('add_project.steps.flutter') ?? 'Flutter'}</Typography>
              <Select value={editFlutterVersion} onChange={(e) => setEditFlutterVersion(String(e.target.value))} fullWidth>
                <MenuItem value="stable">Stable</MenuItem>
                <MenuItem value="3.24.2">3.24.2</MenuItem>
                <MenuItem value="3.22.0">3.22.0</MenuItem>
              </Select>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} disabled={editSaving}>{t('project_page.cancel') ?? 'Cancel'}</Button>
            <Button variant="contained" onClick={handleSaveEdit} disabled={editSaving} startIcon={editSaving ? <CircularProgress size={16} /> : null}>
              {t('project_page.save') ?? 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
