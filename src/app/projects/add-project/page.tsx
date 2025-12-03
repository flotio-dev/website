'use client';

import {
  Box,
  Button,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  Paper
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Menu from '@/app/components/Menu';
import { getTranslations } from '@/lib/clientTranslations';
import { useToast } from '@/lib/hooks/useToast';
import { useAuth } from '@/lib/hooks/useAuth';
import clientApi from "@/lib/utils";
import { Root } from '@/lib/types/github.repos';
export default function AddProjectPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  const [newProject, setNewProject] = useState<any>({
    name: '',
    githubConnected: undefined,
    repo: '',
    buildPath: '/',
    flutterVersion: 'stable',
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  const { token } = useAuth();
  const [installationFound, setInstallationFound] = useState<boolean | null>(null);
  const [repos, setRepos] = useState<Array<any>>([]);
  const [reposLoading, setReposLoading] = useState(false);

  // Charger locale + traductions
  useEffect(() => {
    let mounted = true;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    const loc = stored === 'en' || stored === 'fr' ? stored : 'fr';
    setLocale(loc);

    const load = async () => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Check GitHub App installation for this account
  useEffect(() => {
    let mounted = true;
    const checkInstallation = async () => {
      try {
        try {
          const data = await clientApi<any>('github/installations');
          if (!mounted) return;
          // success -> installation exists
          setInstallationFound(true);
          setNewProject((p: any) => ({ ...p, githubConnected: true }));
        } catch (err: any) {
          if (!mounted) return;
          // clientApi throws with message containing status code, e.g. "API request failed with status 404"
          if (err && typeof err.message === 'string' && err.message.includes('404')) {
            setInstallationFound(false);
            setNewProject((p: any) => ({ ...p, githubConnected: false }));
            return;
          }
          console.debug('GitHub installation check failed', err);
          setInstallationFound(false);
          setNewProject((p: any) => ({ ...p, githubConnected: false }));
          return;
        }
      } catch (err) {
        console.error('Error checking GitHub installation', err);
        if (!mounted) return;
        setInstallationFound(false);
        setNewProject((p: any) => ({ ...p, githubConnected: false }));
      }
    };

    checkInstallation();

    const onGithubToken = () => {
      // re-check when github token event fires
      checkInstallation();
    };
    window.addEventListener('githubToken', onGithubToken as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('githubToken', onGithubToken as EventListener);
    };
  }, [token]);

  // Fetch GitHub repositories when installation is present
  useEffect(() => {
    let mounted = true;
    const fetchRepos = async () => {
      if (installationFound !== true) return;
      try {
        setReposLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          console.debug('NEXT_PUBLIC_API_BASE_URL not set, skipping repos fetch');
          if (mounted) setRepos([]);
          return;
        }
        try {
          const data = await clientApi<Root>("github/repos");
          if (!mounted) return;
          setRepos(data.details?.repositories || []);
        } catch (err) {
          console.error('Failed to fetch GitHub repos', err);
          if (!mounted) return;
          setRepos([]);
          addToast({ message: t('add_project.errors.fetch_repos') || 'Failed to fetch repositories', type: 'error' });
        }
      } catch (err) {
        console.error('Error fetching repos', err);
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
  }, [installationFound, token]);

  // helper t()
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

  const steps = [
    t('add_project.steps.name'),
    t('add_project.steps.github'),
    t('add_project.steps.repo'),
    t('add_project.steps.flutter'),
    t('add_project.steps.summary'),
  ];

  const validateStep = () => {
    const newErrors: any = {};
    if (activeStep === 0 && !newProject.name.trim()) {
      newErrors.name = t('add_project.errors.name_required');
    }
    if (activeStep === 2 && newProject.githubConnected && !newProject.repo) {
      newErrors.repo = t('add_project.errors.repo_required');
    }
    if (activeStep === 3 && !newProject.flutterVersion) {
      newErrors.flutterVersion = t('add_project.errors.flutter_required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      // ensure GitHub connected before creating project
      if (!newProject.githubConnected) {
        addToast({ message: t('add_project.errors.github_required') || 'You must connect GitHub to create a project', type: 'error' });
        return;
      }
      // Final step: create project via backend
      setIsSubmitting(true);
      try {
        const payload = {
          name: newProject.name,
          git_repo: newProject.repo || '',
          build_folder: newProject.buildPath || '',
          flutter_version: newProject.flutterVersion || '',
        };

        // Use central `clientApi` helper which attaches auth header if available
        const data = await clientApi<any>('project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const created = data?.project ?? data;
        addToast({ message: t('add_project.notifications.created') || 'Projet créé', type: 'success' });

        // Redirect to project ID-based overview if available
        const createdId = created?.ID ?? created?.id ?? created?.ID;
        if (createdId) {
          router.push(`/projects/${encodeURIComponent(String(createdId))}/overview`);
        } else {
          // fallback to previous behavior using slug/name
          const redirectSlug = created?.name || created?.slug || newProject.name;
          router.push(`/projects/${redirectSlug}`);
        }
      } catch (err: any) {
        console.error('Project creation failed', err);
        addToast({ message: err?.message || t('add_project.errors.create_failed') || 'Erreur lors de la création', type: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            label={t('add_project.fields.project_name')}
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            data-testid="add-project-name-input"
          />
        );
      case 1:
        return (
          <Stack spacing={2} data-testid="add-project-github-step">
            <Typography>{t('add_project.steps.github')}</Typography>
            {installationFound === null ? (
              <Typography color="text.secondary" data-testid="github-checking-message">{t('add_project.messages.checking_github') || 'Checking GitHub connection...'}</Typography>
            ) : installationFound === true ? (
              <Stack direction="row" spacing={2} alignItems="center" data-testid="github-connected-block">
                <Typography color="success.main" data-testid="github-connected-message">{t('add_project.messages.github_connected') || 'GitHub App installed — connected'}</Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" data-testid="github-not-connected-block">
                <Typography color="text.secondary" data-testid="github-not-connected-message">{t('add_project.messages.github_not_connected') || 'GitHub App not installed'}</Typography>
                <Button
                  component="a"
                  href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP}/installations/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  data-testid="github-connect-button"
                >
                  {t('add_project.actions.connect_github') || 'Connect GitHub'}
                </Button>
              </Stack>
            )}
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2} data-testid="add-project-repo-step">
            <Typography>{t('add_project.steps.repo')}</Typography>
            <Select
              value={newProject.repo}
              onChange={(e) => setNewProject({ ...newProject, repo: e.target.value })}
              fullWidth
              error={!!errors.repo}
              disabled={reposLoading}
              data-testid="add-project-repo-select"
            >
              <MenuItem value="">{`-- ${t('add_project.fields.repo')} --`}</MenuItem>
              {reposLoading ? (
                <MenuItem value="" disabled>{t('add_project.messages.checking_github') || 'Loading...'}</MenuItem>
              ) : repos.length === 0 ? (
                <MenuItem value="" disabled>{t('add_project.messages.no_repos') || 'No repositories found'}</MenuItem>
              ) : (
                repos.map((r: any) => (
                  <MenuItem key={r.id ?? r.full_name} value={r.full_name} data-testid="add-project-repo-option">
                    {r.full_name}{r.private ? ' (private)' : ''}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.repo && <FormHelperText error>{errors.repo}</FormHelperText>}
            <TextField
              label={t('add_project.fields.build_path')}
              value={newProject.buildPath}
              onChange={(e) => setNewProject({ ...newProject, buildPath: e.target.value })}
              fullWidth
              data-testid="add-project-build-path-input"
            />
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={2} data-testid="add-project-flutter-step">
            <Typography>{t('add_project.steps.flutter')}</Typography>
            <Select
              value={newProject.flutterVersion}
              onChange={(e) => setNewProject({ ...newProject, flutterVersion: e.target.value })}
              fullWidth
              error={!!errors.flutterVersion}
              data-testid="add-project-flutter-select"
            >
              <MenuItem value="stable">Stable</MenuItem>
              <MenuItem value="3.24.2">3.24.2</MenuItem>
              <MenuItem value="3.22.0">3.22.0</MenuItem>
            </Select>
            {errors.flutterVersion && (
              <FormHelperText error>{errors.flutterVersion}</FormHelperText>
            )}
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={2} data-testid="add-project-summary-step">
            <Typography variant="h6">{t('add_project.steps.summary')}</Typography>
            <Typography>
              {t('add_project.fields.project_name')} : {newProject.name}
            </Typography>
            <Typography>GitHub : {newProject.githubConnected ? 'Oui' : 'Non'}</Typography>
            {newProject.githubConnected && (
              <>
                <Typography>
                  {t('add_project.fields.repo')} : {newProject.repo}
                </Typography>
                <Typography>
                  {t('add_project.fields.build_path')} : {newProject.buildPath}
                </Typography>
              </>
            )}
            <Typography>
              {t('add_project.fields.flutter_version')} : {newProject.flutterVersion}
            </Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="flex h-screen">
      {/* Sidebar */}
      <Menu />

      {/* Main Content */}
      <Box className="flex-1 p-6" sx={{ bgcolor: 'background.default' }}>
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FolderIcon fontSize="large" color="primary" />
            <Typography variant="h4" className="font-bold" color="text.primary" data-testid="add-project-header-title">
              {t('add_project.title')}
            </Typography>
          </Stack>

          <Link href="/projects" passHref>
            <Button variant="outlined" color="primary">
              {t('add_project.back_to_list')}
            </Button>
          </Link>
        </Box>

        {/* Stepper + content */}
        <Paper className="p-6 shadow-md rounded-xl" sx={{ bgcolor: 'background.paper' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={4}>{renderStep()}</Box>

          {/* Navigation */}
          {(activeStep === 1 && installationFound !== true) ? (
            <Box mt={4} display="flex" justifyContent="flex-start">
              <Button onClick={handleBack} disabled={isSubmitting}>
                {t('add_project.actions.back')}
              </Button>
            </Box>
          ) : (
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} data-testid="add-project-back-btn" >
                {t('add_project.actions.back')}
              </Button>
                <Button variant="contained" onClick={handleNext} disabled={isSubmitting}
                  data-testid={
                    activeStep === steps.length - 1
                      ? 'add-project-create-btn'
                      : 'add-project-next-btn'
                  }>
                {activeStep === steps.length - 1
                  ? t('add_project.actions.create')
                  : t('add_project.actions.next')}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
