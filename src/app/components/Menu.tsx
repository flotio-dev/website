'use client';
import React from 'react';
import { getTranslations } from '../../lib/clientTranslations';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

import {
  Box,
  Stack,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Avatar,
  Popover,
} from '@mui/material';
import Link from 'next/link';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FolderIcon from '@mui/icons-material/Folder';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SettingsIcon from '@mui/icons-material/Settings';
// Light/Dark icons removed from menu (theme control moved to settings)

// Theme provider context (theme control moved to settings)


/***********************
 * Profile Block
 ***********************/
function ProfileBlock({ t }: { t: (k: string) => string }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const name = user?.Keycloak?.preferred_username ?? '';
  const email = user?.Keycloak?.email ?? '';

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      >
        <Avatar>{(name?.[0] ?? 'U').toUpperCase()}</Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" color="text.primary" noWrap>
            {name || t('menu.anonymous') || 'Anonymous'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {email}
          </Typography>
        </Box>
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
              <Avatar sx={{ width: 40, height: 40 }}>
                {(name?.[0] ?? 'U').toUpperCase()}
              </Avatar>
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
                logout();
              }}
            >
              {t('login.sign_out')}
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

/* Theme selector moved to account settings */

/***********************
 * Main Menu
 ***********************/
export default function Menu() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    if (user) {
      (async () => {
        try {
          const bearer = user.Keycloak.token ?? null;

          if (!bearer) return;

          const res = await fetch('/api/keycloak/github-token', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${bearer}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) {
            console.debug('Failed to fetch github token from broker:', await res.text());
            return;
          }

          const data = await res.json();
          const token = data?.github_access_token ?? data?.token ?? null;
          if (token) {
            console.debug('Got github token (redacted)');
            try {
              if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(new CustomEvent('githubToken', { detail: data }));
              }
            } catch (err) {
              console.debug('Error emitting github token event:', err);
            }
          }
        } catch (err) {
          console.debug('Error fetching github token from broker:', err);
        }
      })();
    }
  }, [isLoading, user, router]);

  const pathname = usePathname();
  const [translations, setTranslations] = React.useState<Record<string, unknown> | null>(null);

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

  const [locale, setLocale] = React.useState(() => getPreferredLocale(pathname));

  React.useEffect(() => {
    let mounted = true;
    const load = async (loc: string) => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load(locale);

    const onLocaleChanged = (e: CustomEvent) => {
      const newLoc = e?.detail ?? (typeof window !== 'undefined' ? localStorage.getItem('lang') : null);
      if (newLoc) setLocale(newLoc);
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
    let cur: unknown = translations;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = (cur as Record<string, unknown>)[p];
      else return key;
    }
    return typeof cur === 'string' ? cur : key;
  };

  const sections = [
    {
      title: t('menu.main'),
      items: [
        { label: t('menu.dashboard'), href: '/dashboard', icon: <SpaceDashboardIcon /> },
        { label: t('menu.projects'), href: '/projects', icon: <FolderIcon /> },
        //{ label: t('menu.manage_organization'), href: '/organization', icon: <GroupIcon /> },
        { label: t('menu.environment_variables'), href: '/environment-variables', icon: <DataObjectIcon /> },
        //{ label: t('menu.billing'), href: '/billing', icon: <CreditCardIcon /> },
      ],
    },
    // {
    //   title: t('menu.credentials'),
    //   items: [
    //     { label: t('menu.credentials_page'), href: '/credentials', icon: <VpnKeyIcon /> },
    //     { label: t('menu.access_tokens'), href: '/tokens', icon: <TokenIcon /> },
    //   ],
    // },
    // settings moved to profile popover
  ];

  const isActive = (href: string) => (href !== '/' ? pathname?.startsWith(href) : pathname === '/');

  return (
    /* Reserve horizontal space in the layout so main content stays shifted,
       but render an inner fixed box so the menu remains always visible on scroll */
    <Box sx={{ width: '16rem', flex: '0 0 16rem' }} className="w-64">
      <Box
        className="p-4 flex flex-col"
        sx={{
          // Use fixed position on medium+ screens so the menu stays visible.
          // On small screens keep it in-flow (relative) to avoid covering content.
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
          Flotio
        </Typography>
      </Stack>

      <Divider className="my-2" />

      {/* Navigation - scrollable area */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        <Stack spacing={3}>
          {sections.map((section) => (
            <List
              key={section.title}
              disablePadding
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    px: 0,
                    backgroundColor: 'background.paper',
                    color: 'text.secondary',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {section.title}
                </ListSubheader>
              }
            >
              {section.items.map((item) => (
                <ListItemButton
                  key={item.label}
                  component={Link}
                  href={item.href}
                  selected={isActive(item.href)}
                  sx={{
                    borderRadius: 1.5,
                    px: 1.25,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                    },
                    '&.Mui-selected .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  />
                </ListItemButton>
              ))}

            </List>
          ))}
        </Stack>
      </Box>

      {/* Footer - theme selector + profile */}
      <Divider className="my-2" />
      <Box>
        <ProfileBlock t={t} />
      </Box>
    </Box>
    </Box>
  );
}
