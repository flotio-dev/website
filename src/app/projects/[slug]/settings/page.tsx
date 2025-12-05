'use client';

import {
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    Breadcrumbs,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Link as MUILink,
    useTheme,
    Skeleton,
    CircularProgress,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { getTranslations } from '@/lib/clientTranslations';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import clientApi, { clientApiRaw } from '@/lib/utils';
import ProjectSubMenu from '@/app/components/ProjectSubMenu';

// ---- Types
interface ProjectSettings {
    name: string;
    slug: string;
    id?: number | string;
    created_at?: string;
    updated_at?: string;
    git_repo: string;
    build_folder: string;
    flutter_version: string;
}

// ---- Helpers i18n
const getPreferredLocale = (p?: string | null) => {
    try {
        const stored =
            typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
        if (stored === 'en' || stored === 'fr') return stored;
    } catch {
        // ignore
    }
    if (!p) return 'fr';
    const parts = p.split('/');
    const candidate = parts[1];
    if (candidate === 'en' || candidate === 'fr') return candidate;
    return 'fr';
};

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

export default function SettingsPage() {
    const pathname = usePathname() ?? '/';
    const params = useParams() as { slug?: string } | undefined;
    const router = useRouter();
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const pathParts = pathname.split('/').filter(Boolean);
    const candidateSlugFromPath = params?.slug ?? pathParts[1] ?? pathParts[0];

    const { token } = useAuth();
    const { addToast } = useToast();

    // i18n
    const [locale, setLocale] = useState<'fr' | 'en'>(
        () => getPreferredLocale(pathname) as 'fr' | 'en'
    );
    const [translations, setTranslations] = useState<Record<string, any> | null>(
        null
    );

    // Loading states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    // Cooldown refs
    const lastFailedSlugRef = useRef<string | null>(null);
    const lastFailedAtRef = useRef<number | null>(null);

    // Project data
    const [settings, setSettings] = useState<ProjectSettings>({
        name: '',
        slug: '',
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        git_repo: '',
        build_folder: '',
        flutter_version: 'stable',
    });

    // Load translations
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
            if (newLoc === 'en' || newLoc === 'fr') setLocale(newLoc);
        };

        window.addEventListener('localeChanged', onLocaleChanged as EventListener);
        const onStorage = () => onLocaleChanged(null);
        window.addEventListener('storage', onStorage);

        return () => {
            mounted = false;
            window.removeEventListener(
                'localeChanged',
                onLocaleChanged as EventListener
            );
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

    // Fetch project data
    useEffect(() => {
        let mounted = true;
        const idOrSlug = candidateSlugFromPath ?? '';
        if (!idOrSlug) return;

        // Cooldown check
        const cooldownMs = 60_000;
        if (
            lastFailedSlugRef.current === idOrSlug &&
            lastFailedAtRef.current &&
            Date.now() - lastFailedAtRef.current < cooldownMs
        ) {
            if (mounted) setNotFound(true);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchProject = async () => {
            setLoading(true);
            setNotFound(false);
            setFetchErrorMessage(null);
            try {
                const res = await clientApiRaw(`project/${idOrSlug}`, { signal: controller.signal });
                const data = await res.json().catch(() => null);

                if (res.status === 404) {
                    if (mounted) {
                        setNotFound(true);
                        setFetchErrorMessage(data?.message ?? `Project "${idOrSlug}" not found`);
                        addToast({ message: data?.message ?? 'Project not found', type: 'error' });
                    }
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
                    setSettings({
                        name: p.name ?? '',
                        slug: p.slug ?? p.name ?? '',
                        id: p.ID ?? p.id ?? undefined,
                        created_at: p.created_at ?? p.CreatedAt ?? undefined,
                        updated_at: p.updated_at ?? p.UpdatedAt ?? undefined,
                        git_repo: p.git_repo ?? p.git_repository ?? '',
                        build_folder: p.build_folder ?? '',
                        flutter_version: p.flutter_version ?? 'stable',
                    });

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
    }, [candidateSlugFromPath, token, addToast]);

    const slugForMenu = settings.id ? String(settings.id) : candidateSlugFromPath ?? settings.slug ?? 'project';

    const handleChange =
        (field: keyof ProjectSettings) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                setSettings((prev) => ({ ...prev, [field]: value }));
            };

    const handleSelectChange =
        (field: keyof ProjectSettings) =>
            (e: any) => {
                const value = e.target.value as string;
                setSettings((prev) => ({ ...prev, [field]: value }));
            };

    const handleSave = async () => {
        const id = settings.id ?? candidateSlugFromPath ?? settings.slug ?? '';
        if (!id) {
            addToast({ message: 'Project identifier missing', type: 'error' });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: settings.name,
                git_repo: settings.git_repo,
                build_folder: settings.build_folder,
                flutter_version: settings.flutter_version,
            };

            const data = await clientApi<any>(`project/${encodeURIComponent(String(id))}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const p = data?.project ?? data;
            setSettings((prev) => ({
                ...prev,
                name: p.name ?? prev.name,
                git_repo: p.git_repo ?? p.git_repository ?? prev.git_repo,
                build_folder: p.build_folder ?? prev.build_folder,
                flutter_version: p.flutter_version ?? prev.flutter_version,
                updated_at: p.updated_at ?? p.UpdatedAt ?? prev.updated_at,
            }));

            addToast({ message: t('add_project.notifications.updated') ?? 'Projet mis à jour', type: 'success' });
        } catch (err: any) {
            console.error('Failed to save project', err);
            addToast({ message: err?.message || 'Erreur lors de la mise à jour', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Helper for text color based on theme
    const getTextColorSx = () => ({
        '& input': {
            color: isDarkMode ? '#fff !important' : '#000 !important',
        },
        '& textarea': {
            color: isDarkMode ? '#fff !important' : '#000 !important',
        },
    });

    // Loading state
    if (loading) {
        return (
            <Box className="flex h-screen">
                <ProjectSubMenu slug={slugForMenu} />
                <Box className="flex-1 overflow-auto" sx={{ p: 6, bgcolor: 'background.default' }}>
                    <Stack spacing={2}>
                        <Skeleton variant="rectangular" height={48} />
                        <Skeleton variant="rectangular" height={200} />
                        <Skeleton variant="rectangular" height={200} />
                    </Stack>
                </Box>
            </Box>
        );
    }

    // Not found state
    if (notFound) {
        return (
            <Box className="flex h-screen">
                <ProjectSubMenu slug={slugForMenu} />
                <Box className="flex-1 overflow-auto" sx={{ p: 6, bgcolor: 'background.default' }}>
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

            <Box
                className="flex-1 overflow-auto"
                sx={{ p: 6, bgcolor: 'background.default' }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Stack spacing={1}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <MUILink underline="hover" color="inherit" href="/projects">
                                {t('project_page.projects')}
                            </MUILink>
                            <MUILink underline="hover" color="inherit" href={`/projects/${slugForMenu}/overview`}>
                                {settings.name || 'Project'}
                            </MUILink>
                            <Typography color="text.primary">{t('menu.settings')}</Typography>
                        </Breadcrumbs>

                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            {t('menu.settings')}
                        </Typography>
                    </Stack>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} /> : null}
                    >
                        {saving ? (t('common.saving') ?? 'Saving...') : (t('common.save') ?? 'Enregistrer')}
                    </Button>
                </Stack>

                {/* Contenu */}
                <Stack spacing={3}>
                    {/* Overview */}
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('project_page.overview')}
                        </Typography>

                        <Stack spacing={2} mt={1}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                            >
                                <TextField
                                    label={t('common.name') ?? 'Nom'}
                                    value={settings.name}
                                    onChange={handleChange('name')}
                                    fullWidth
                                    color="primary"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            style: { color: isDarkMode ? '#fff' : '#000' },
                                        },
                                    }}
                                    sx={getTextColorSx()}
                                />
                                <TextField
                                    label={t('common.slug') ?? 'Slug'}
                                    value={settings.slug}
                                    fullWidth
                                    disabled
                                    slotProps={{
                                        input: {
                                            style: { color: isDarkMode ? '#fff' : '#000' },
                                        },
                                    }}
                                    sx={getTextColorSx()}
                                />
                            </Stack>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                            >
                                <TextField
                                    label={t('project_page.created_at') ?? 'Créé le'}
                                    value={formatDate(settings.created_at, locale)}
                                    fullWidth
                                    disabled
                                    slotProps={{
                                        input: {
                                            style: { color: isDarkMode ? '#fff' : '#000' },
                                        },
                                    }}
                                    sx={getTextColorSx()}
                                />
                                <TextField
                                    label={t('project_page.updated_at') ?? 'Mis à jour le'}
                                    value={formatDate(settings.updated_at, locale)}
                                    fullWidth
                                    disabled
                                    slotProps={{
                                        input: {
                                            style: { color: isDarkMode ? '#fff' : '#000' },
                                        },
                                    }}
                                    sx={getTextColorSx()}
                                />
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Build settings */}
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('project_page.build_settings') ?? 'Build settings'}
                        </Typography>

                        <Stack spacing={2} mt={1}>
                            <TextField
                                label={t('project_page.git_repo') ?? 'Git repo'}
                                value={settings.git_repo}
                                onChange={handleChange('git_repo')}
                                fullWidth
                                slotProps={{
                                    input: {
                                        style: { color: isDarkMode ? '#fff' : '#000' },
                                    },
                                }}
                                sx={getTextColorSx()}
                            />

                            <TextField
                                label={t('project_page.build_folder') ?? 'Build folder'}
                                value={settings.build_folder}
                                onChange={handleChange('build_folder')}
                                fullWidth
                                slotProps={{
                                    input: {
                                        style: { color: isDarkMode ? '#fff' : '#000' },
                                    },
                                }}
                                sx={getTextColorSx()}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="flutter-version-label">
                                    {t('project_page.flutter_version') ?? 'Flutter version'}
                                </InputLabel>
                                <Select
                                    labelId="flutter-version-label"
                                    label={t('project_page.flutter_version') ?? 'Flutter version'}
                                    value={settings.flutter_version}
                                    onChange={handleSelectChange('flutter_version')}
                                >
                                    <MenuItem value="stable">Stable</MenuItem>
                                    <MenuItem value="master">Master</MenuItem>
                                    <MenuItem value="beta">Beta</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Box>
    );
}
