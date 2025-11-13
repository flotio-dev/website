'use client';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Paper,
  Menu as MUIMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import Menu from '../components/Menu';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../lib/hooks/useToast';
import { useAuth } from '../../lib/hooks/useAuth';
import Link from 'next/link';
import { getTranslations } from '../../lib/clientTranslations';

interface Project {
  ID?: number;
  name: string;
  git_repo?: string;
  build_folder?: string;
  flutter_version?: string;
  user_id?: number;
  slug?: string;
  CreatedAt?: string;
}

const EMPTY: Project[] = [];

export default function ListingProjects() {
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);

  const detectLocale = (p?: string | null) => {
    if (!p) return 'fr';
    const parts = p.split('/');
    const candidate = parts[1];
    if (candidate === 'en' || candidate === 'fr') return candidate;
    return 'fr';
  };

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
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

  const [locale, setLocale] = typeof window !== 'undefined' ? useState(() => getPreferredLocale(pathname)) : useState('fr');
  const { addToast } = useToast();
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<string | number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async (loc: string) => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load(locale);

    const onLocaleChanged = (e: any) => {
      const newLoc = e?.detail ?? (typeof window !== 'undefined' ? localStorage.getItem('lang') : null);
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

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/proxy/project?limit=20', { headers });
        const data = await res.json();
        if (!res.ok) {
          const msg = data?.error || data?.message || JSON.stringify(data) || 'Failed to fetch projects';
          throw new Error(msg);
        }

        // API might return { projects: [...] } or an array
        const items: Project[] = data?.projects ?? data ?? [];
        if (mounted) setProjects(items);
      } catch (err: any) {
        console.error('Failed to fetch projects', err);
        if (mounted) {
          setError(err?.message || 'Erreur lors du chargement');
          addToast({ message: err?.message || 'Erreur lors du chargement des projets', type: 'error' });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, [token]);

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
  return (
    <Box className="flex h-screen">
      {/* Sidebar */}
      <Menu />

      {/* Main Content */}
      <Box
        className="flex-1 p-6"
        sx={{ bgcolor: "background.default" }}
      >
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FolderIcon fontSize="large" color="primary" />
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {t('listing_projects.projects')}
            </Typography>
          </Stack>
          <Link href="/projects/add-project" passHref>
            <Button variant="contained" color="primary">
              {t('listing_projects.create_project')}
            </Button>
          </Link>
        </Box>

        {/* Projects Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                  {t('common.name')}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                  {t('listing_projects.recent_activity')}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                  Slug
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => {
                const idOrSlug = project.ID ?? encodeURIComponent(project.slug ?? project.name);
                const target = `/projects/${idOrSlug}/overview`;

                return (
                  <TableRow
                    key={project.slug ?? index}
                    hover
                    onClick={() => router.push(target)}
                    sx={{
                      '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {
                        bgcolor: 'background.paper',
                      },
                      '&:nth-of-type(even) td, &:nth-of-type(even) th': {
                        bgcolor: 'background.default',
                      },
                      '&:hover td, &:hover th': {
                        bgcolor: 'action.hover',
                      },
                      transition: 'background-color 120ms ease',
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                          {project.name[0]}
                        </Avatar>
                        <Link href={target} passHref>
                          <Typography
                            color="text.primary"
                            sx={{
                              textDecoration: 'none',
                              fontWeight: 500,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {project.name}
                          </Typography>
                        </Link>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography color="text.secondary">{project.CreatedAt ? new Date(project.CreatedAt).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') : '-'}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography color="text.secondary">{project.slug ?? project.name ?? '-'}</Typography>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        aria-controls={menuAnchorEl ? 'project-row-menu' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idOrSlugLocal = project.ID ?? encodeURIComponent(project.slug ?? project.name);
                          setMenuTargetId(idOrSlugLocal);
                          setMenuAnchorEl(e.currentTarget as HTMLElement);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Row action menu */}
        <MUIMenu
          id="project-row-menu"
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => {
            setMenuAnchorEl(null);
            setMenuTargetId(null);
          }}
          onClick={() => {
            /* prevent row click propagation */
            // noop
          }}
        >
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation();
              // confirm
              const ok = window.confirm('Supprimer ce projet ?');
              if (!ok) {
                setMenuAnchorEl(null);
                setMenuTargetId(null);
                return;
              }
              try {
                const idToDelete = menuTargetId;
                if (!idToDelete) throw new Error('No project id');
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const base = process.env.NEXT_PUBLIC_API_BASE_URL;
                if (!base) throw new Error('API base URL not configured (NEXT_PUBLIC_API_BASE_URL)');
                const url = `${base.replace(/\/+$/g, '')}/project/${encodeURIComponent(String(idToDelete))}`;
                const res = await fetch(url, { method: 'DELETE', headers });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.message || 'Failed to delete project');
                // remove locally
                setProjects((prev) => prev.filter((p) => (p.ID ?? encodeURIComponent(p.slug ?? p.name)) !== idToDelete));
                addToast({ message: 'Projet supprimé', type: 'success' });
              } catch (err: any) {
                console.error('Delete project failed', err);
                addToast({ message: err?.message || 'Erreur lors de la suppression', type: 'error' });
              } finally {
                setMenuAnchorEl(null);
                setMenuTargetId(null);
              }
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItem>
        </MUIMenu>
      </Box>
    </Box>
  );
}