"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslations } from '@/lib/clientTranslations';
import { useAuth } from '@/lib/hooks/useAuth';

import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Popover,
} from '@mui/material';

// Icons
import FolderIcon from '@mui/icons-material/Folder';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
// Light/Dark icons removed from ProjectSubMenu (theme control moved to settings)

// Theme selector removed from ProjectSubMenu - moved to account settings

function ProfileBlock({ t, slug }: { t: (k: string) => string; slug?: string }) {
  const { user, logout } = useAuth();
  const name = user?.Keycloak.preferred_username ?? '';
  const email = user?.Keycloak.email ?? '';
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            ref={anchorRef}
            onClick={() => setOpen((v) => !v)}
            sx={{ p: 0, textTransform: 'none', justifyContent: 'flex-start' }}
          >
            <Avatar>{(name?.[0] ?? 'U').toUpperCase()}</Avatar>
            <Box sx={{ ml: 1, textAlign: 'left' }}>
              <Typography variant="subtitle2" color="text.primary" noWrap>
                {name || t('menu.anonymous') || 'Anonymous'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {email}
              </Typography>
            </Box>
          </Button>
        </Box>

        <Popover
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Box sx={{ width: 224, p: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }}>{(name?.[0] ?? 'U').toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="subtitle1" color="text.primary">
                    {name || t('menu.anonymous') || 'Anonymous'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {email}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setOpen(false);
                  router.push('/settings');
                }}
                sx={{ mb: 1 }}
              >
                {t('menu.account_settings') || 'Settings'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setOpen(false);
                  logout?.();
                }}
              >
                {t('login.sign_out')}
              </Button>
            </Stack>
          </Box>
        </Popover>
      </Stack>
    </Box>
  );
}

export default function ProjectSubMenu({ slug }: { slug: string }) {
  const pathname = usePathname();
  const [translations, setTranslations] = React.useState<Record<string, unknown> | null>(null);

  const getPreferredLocale = (p?: string | null) => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
      if (stored === 'en' || stored === 'fr') return stored;
    } catch {}
    if (!p) return 'fr';
    const parts = p.split('/');
    const candidate = parts[1];
    if (candidate === 'en' || candidate === 'fr') return candidate;
    return 'fr';
  };

  const [locale] = React.useState(() => getPreferredLocale(pathname));

  React.useEffect(() => {
    let mounted = true;
    const load = async (loc: string) => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load(locale);
    const onLocaleChanged = (e: CustomEvent) => {
      const newLoc = e?.detail ?? (typeof window !== 'undefined' ? localStorage.getItem('lang') : null);
      if (newLoc) setTranslations(null); // will reload via effect
    };
    window.addEventListener('localeChanged', onLocaleChanged as EventListener);
    const onStorage = () => onLocaleChanged(new CustomEvent('storage'));
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

  const sections = [
    {
      title: t('menu.main') || 'Général',
      items: [
        { label: t('menu.dashboard') || 'Dashboard', href: '/dashboard', icon: <SpaceDashboardIcon /> },
        { label: t('menu.projects') || 'Projets', href: '/projects', icon: <FolderIcon /> },
      ],
    },
    {
      title: t('menu.project') || 'Projet',
      items: [
        { label: t('project_page.overview') || 'Overview', href: `/projects/${slug}/overview`, icon: <InfoIcon /> },
        { label: t('project_page.builds') || 'Builds', href: `/projects/${slug}/builds`, icon: <BuildIcon /> },
        { label: t('project_page.environment') || 'Variables Env', href: `/projects/${slug}/environment`, icon: <DataObjectIcon /> },
        { label: t('project_page.settings') || 'Parametres', href: `/projects/${slug}/settings`, icon: <SettingsIcon /> },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    const normalize = (p: string) => p.replace(/\/+$/g, '');
    const np = normalize(pathname);
    const nh = normalize(href);

    // Treat the main projects listing as active only on the exact listing page
    if (nh === '/projects') return np === nh;

    // For other links, consider equal or prefix (e.g. /projects/3 -> /projects/3/overview)
    return np === nh || np.startsWith(nh + '/');
  };

  return (
    // Reserve space for the sidebar in the layout, but render the actual menu as fixed
    <Box sx={{ width: '16rem', flex: '0 0 16rem' }} className="w-64">
      <Box
        className="p-4 flex flex-col"
        sx={{
          // Make the submenu fixed on larger screens so it stays visible while scrolling.
          position: { xs: 'relative', md: 'fixed' },
          left: { md: 0 },
          top: { md: 0 },
          height: { md: '100vh' },
          width: '16rem',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto',
          zIndex: (theme) => (theme.zIndex.drawer ?? 1200) + 1,
        }}
      >
      {/* Brand */}
      <Stack direction="row" alignItems="center" spacing={1.5} className="mb-1">
        <Box className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
          <RocketLaunchIcon fontSize="small" />
        </Box>
        <Typography variant="h6" className="font-extrabold tracking-tight" color="text.primary">
          Project
        </Typography>
      </Stack>

      <Divider className="my-2" />

      {/* Navigation - scrollable area */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {sections.map((section) => (
          <Box key={String(section.title)} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ pl: 1, mb: 1, color: 'text.secondary' }}>
              {section.title}
            </Typography>
            <List>
              {section.items.map((item) => (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={isActive(item.href)}
                  sx={{
                    borderRadius: 1.5,
                    px: 1.25,
                    '&.Mui-selected': { bgcolor: 'action.selected' },
                    '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': { bgcolor: 'action.hover' },
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: 'text.primary' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Divider className="my-2" />
      <Box>
        <ProfileBlock t={t} slug={slug} />
      </Box>
    </Box>
    </Box>
  );
}
