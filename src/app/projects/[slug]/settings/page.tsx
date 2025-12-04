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
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { getTranslations } from '@/lib/clientTranslations';
import ProjectSubMenu from '@/app/components/ProjectSubMenu';

// ---- Types
interface ProjectSettings {
    name: string;
    slug: string;
    owner: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
    gitRepo: string;
    buildFolder: string;
    flutterVersion: string;
}

interface ProjectShape {
    name: string;
    slug: string;
    urlPath: string;
}

// ---- Mock data
const MOCK_SETTINGS: ProjectSettings = {
    name: 'test',
    slug: 'test',
    owner: 'user',
    createdAt: '2025-11-27T14:53:00Z',
    updatedAt: '2025-11-27T14:53:00Z',
    gitRepo: 'Kakouuu/PPE1-iPear',
    buildFolder: '/',
    flutterVersion: 'stable',
};

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

export default function SettingsPage() {
    const pathname = usePathname() ?? '/';
    const params = useParams() as { slug?: string } | undefined;
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const pathParts = pathname.split('/').filter(Boolean);
    const candidateSlugFromPath = params?.slug ?? pathParts[1] ?? pathParts[0];
    const slugForMenu = candidateSlugFromPath ?? MOCK_SETTINGS.slug;

    // i18n
    const [locale, setLocale] = useState<'fr' | 'en'>(
        () => getPreferredLocale(pathname) as 'fr' | 'en'
    );
    const [translations, setTranslations] = useState<Record<string, any> | null>(
        null
    );

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

    // ---- Local state (front-only)
    const [settings, setSettings] = useState<ProjectSettings>(MOCK_SETTINGS);
    const [projectData, setProjectData] = useState<any | null>(null);

    const project: ProjectShape = useMemo(() => {
        const base: ProjectShape = {
            name: settings.name || 'Project',
            slug: settings.slug || slugForMenu || 'project',
            urlPath: `/build/${settings.slug || slugForMenu || 'project'}`,
        };

        if (projectData && projectData.name) {
            const pd: any = projectData;
            return {
                name: pd.name ?? base.name,
                slug: pd.slug ?? pd.name ?? base.slug,
                urlPath: pd.urlPath ?? `/build/${pd.slug ?? pd.name ?? base.slug}`,
            };
        }

        return base;
    }, [settings, projectData, slugForMenu]);

    const handleChange =
        (field: keyof ProjectSettings) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                setSettings((prev) => ({ ...prev, [field]: value }));
            };

    const handleSelectChange =
        (field: keyof ProjectSettings) =>
            (e: any /* SelectChangeEvent<string> */) => {
                const value = e.target.value as string;
                setSettings((prev) => ({ ...prev, [field]: value }));
            };

    const handleSave = () => {
        // FRONT-ONLY : à remplacer par un call API plus tard
        console.log('Saving settings (front-only demo):', settings);
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

    return (
        <Box className="flex h-screen">
            {/* Sidebar projet */}
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
                            <Typography color="text.primary">{project.name}</Typography>
                        </Breadcrumbs>

                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            {t('menu.settings')}
                        </Typography>
                    </Stack>

                    <Button variant="contained" onClick={handleSave}>
                        {t('common.save')}
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
                                    label={t('common.name')}
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
                                    label={t('common.slug')}
                                    value={settings.slug}
                                    onChange={handleChange('slug')}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            style: { color: isDarkMode ? '#fff' : '#000' },
                                        },
                                    }}
                                    sx={getTextColorSx()}
                                />
                                <TextField
                                    label={t('project_page.owner')}
                                    value={settings.owner}
                                    onChange={handleChange('owner')}
                                    fullWidth
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
                                    label={t('project_page.created_at')}
                                    value={new Date(settings.createdAt).toLocaleString()}
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
                                    label={t('project_page.updated_at')}
                                    value={new Date(settings.updatedAt).toLocaleString()}
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
                            {t('project_page.build_settings') || 'Build settings'}
                        </Typography>

                        <Stack spacing={2} mt={1}>
                            <TextField
                                label={t('project_page.git_repo') || 'Git repo'}
                                value={settings.gitRepo}
                                onChange={handleChange('gitRepo')}
                                fullWidth
                                slotProps={{
                                    input: {
                                        style: { color: isDarkMode ? '#fff' : '#000' },
                                    },
                                }}
                                sx={getTextColorSx()}
                            />

                            <TextField
                                label={t('project_page.build_folder') || 'Build folder'}
                                value={settings.buildFolder}
                                onChange={handleChange('buildFolder')}
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
                                    {t('project_page.flutter_version') || 'Flutter version'}
                                </InputLabel>
                                <Select
                                    labelId="flutter-version-label"
                                    label={t('project_page.flutter_version') || 'Flutter version'}
                                    value={settings.flutterVersion}
                                    onChange={handleSelectChange('flutterVersion')}
                                >
                                    <MenuItem value="stable">stable</MenuItem>
                                    <MenuItem value="beta">beta</MenuItem>
                                    <MenuItem value="master">master</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Box>
    );
}
