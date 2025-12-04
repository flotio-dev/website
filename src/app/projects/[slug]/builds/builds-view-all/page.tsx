"use client";

import {
  Box,
  Typography,
  Stack,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Breadcrumbs,
  Link as MUILink,
  InputAdornment,
} from "@mui/material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProjectSubMenu from "../../../../components/ProjectSubMenu";
import { useLocalization } from "../../../../../lib/hooks/useLocalization";
import clientApi from '../../../../../lib/utils';
import { useToast } from '../../../../../lib/hooks/useToast';

/*******************
 * Types & Mock Data
 *******************/
interface BuildItem {
  id: string;
  status: "success" | "failed" | "running";
  description: string;
  branch: string;
  author: string;
  startedAt: string; // début
  finishedAt?: string; // fin
  duration: string | number;
  commit: string;
  platform?: string;
}

const mockBuilds: BuildItem[] = [
  {
    id: "build_54",
    status: "success",
    description: "feat: Update video provider configurations",
    branch: "main",
    author: "delikescance",
    startedAt: "2025-10-19T21:21:00Z",
    finishedAt: "2025-10-19T21:23:00Z",
    duration: "2m 0s",
    commit: "26c00b2",
    platform: 'android',
  },
  {
    id: "build_53",
    status: "success",
    description: "feat: add sitemap generation and anime API",
    branch: "main",
    author: "delikescance",
    startedAt: "2025-10-17T20:09:00Z",
    finishedAt: "2025-10-17T20:11:31Z",
    duration: "2m 31s",
    commit: "2169c6e",
    platform: 'ios',
  },
  {
    id: "build_52",
    status: "failed",
    description: "feat: Add metadata parsing and caching",
    branch: "main",
    author: "delikescance",
    startedAt: "2025-10-16T23:56:00Z",
    finishedAt: "2025-10-16T23:58:06Z",
    duration: "2m 6s",
    commit: "8cdd761",
    platform: 'android',
  },
];

  const formatDate = (iso: string | undefined, locale: string) => {
  try {
      const d = new Date(iso ?? '');
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
};

const formatDuration = (d?: string | number) => {
  if (d == null || d === '') return '—';
  const num = typeof d === 'number' ? d : Number(String(d).replace(/[^0-9.-]/g, ''));
  if (!isNaN(num) && isFinite(num)) {
    const seconds = Math.max(0, Math.floor(num));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }
  return String(d);
};

/*******************
 * Status chip
 *******************/
function StatusChip({
  status,
  t,
}: {
  status: BuildItem["status"];
  t: (k: string) => string;
}) {
  const map = {
    success: {
      icon: <CheckCircleIcon fontSize="small" />,
      color: "success",
      label: t("project_page.success"),
    },
    failed: {
      icon: <CancelIcon fontSize="small" />,
      color: "error",
      label: t("project_page.failed"),
    },
    running: {
      icon: <ScheduleIcon fontSize="small" />,
      color: "default",
      label: t("project_page.running"),
    },
  };
  const { icon, color, label } = map[status];
  return <Chip icon={icon} label={label} color={color as any} size="small" />;
}

/*******************
 * Page
 *******************/
export default function BuildListPage() {
  const [filter, setFilter] = useState("");
  const pathname = usePathname() ?? "/";
  const params = useParams() as { slug?: string } | undefined;
  const { addToast } = useToast();

  const router = useRouter();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuBuildId, setMenuBuildId] = useState<string | null>(null);
  const openBuildMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuBuildId(id);
  };
  const closeBuildMenu = () => {
    setMenuAnchorEl(null);
    setMenuBuildId(null);
  };

  const [builds, setBuilds] = useState<BuildItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  // slug pour le sous-menu projet
  const pathParts = pathname.split("/").filter(Boolean);
  const candidateSlugFromPath = params?.slug ?? pathParts[1] ?? pathParts[0];
  const slugForMenu = candidateSlugFromPath ?? "project";
  // compute candidate id/slug from path (same as other pages)
  const idOrSlug = candidateSlugFromPath;

  useEffect(() => {
    let mounted = true;
    if (!idOrSlug) return;
    const fetchBuilds = async () => {
      setLoading(true);
      try {
        const res = await clientApi<any>(`project/${encodeURIComponent(String(idOrSlug))}/builds`);

        const list = res?.builds ?? res ?? [];
        const mapped: BuildItem[] = Array.isArray(list)
          ? list.map((b: any) => ({
              id: String(b.ID ?? b.id ?? ''),
              status: b.status === 'running' ? 'running' : (b.status === 'failed' ? 'failed' : 'success'),
              description: b.description ?? b.message ?? b.commit_message ?? '',
              branch: b.branch ?? b.build_branch ?? '',
              author: b.project?.user?.username ?? b.user?.username ?? b.author ?? '',
              startedAt: b.CreatedAt ?? b.startedAt ?? b.createdAt ?? b.date ?? '',
              finishedAt: b.UpdatedAt ?? b.finishedAt ?? undefined,
              duration: b.duration ?? b.duration_seconds ?? b.duration_sec ?? b.duration_text ?? b.duration_str ?? 0,
              commit: b.commit ?? b.short_commit ?? '',
              platform: b.platform ?? b.target ?? '',
            }))
          : [];

        // sort newest first by startedAt
        mapped.sort((a, b) => {
          const ta = Date.parse(a.startedAt) || 0;
          const tb = Date.parse(b.startedAt) || 0;
          return tb - ta;
        });

        if (mounted) setBuilds(mapped);
      } catch (err: any) {
        console.error('Failed to fetch builds', err);
        if (mounted) {
          setBuilds([]);
          addToast({ message: err?.message ?? 'Failed to fetch builds', type: 'error' });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBuilds();
    return () => { mounted = false; };
  }, [idOrSlug, addToast]);

  const filteredBuilds = (builds ?? mockBuilds).filter((b) =>
    (b.description ?? '').toLowerCase().includes(filter.toLowerCase())
  );

  const { locale, t } = useLocalization();

  return (
    <Box className="flex h-screen">
      {/* Sidebar projet */}
      <ProjectSubMenu slug={slugForMenu} />

      {/* Main */}
      <Box
        className="flex-1 overflow-auto"
        sx={{ p: 6, bgcolor: "background.default" }}
      >
        {/* Header */}
        <Stack spacing={1} mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <MUILink underline="hover" color="inherit" href="/projects">
              {t("project_page.projects")}
            </MUILink>
            <MUILink
              underline="hover"
              color="inherit"
              href={`/projects/${slugForMenu}/overview`}
            >
              {candidateSlugFromPath ?? "Project"}
            </MUILink>
            <Typography color="text.primary">
              {t("build_list.title")}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" color="text.primary">
            {t("build_list.title")}
          </Typography>
        </Stack>

        {/* Search */}
        <TextField
          placeholder={t("build_list.filter_placeholder")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Table */}
        <Paper
          className="rounded-xl shadow-sm"
          sx={{ bgcolor: "background.paper" }}
        >
          <TableContainer>
            <Table>
                  <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Début</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Plateforme</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBuilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        {t("build_list.no_builds")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBuilds.map((b, i) => (
                    <TableRow
                      key={`${b.id ?? b.startedAt ?? 'build'}-${i}`}
                      hover
                      sx={{
                        "&:nth-of-type(odd) td": {
                          bgcolor: "background.paper",
                        },
                        "&:nth-of-type(even) td": {
                          bgcolor: "background.default",
                        },
                        "&:hover td": { bgcolor: "action.hover" },
                        transition: "background-color 120ms ease",
                      }}
                    >
                      <TableCell>
                        <MUILink
                          underline="hover"
                          href={`/projects/${slugForMenu}/builds/builds-logs`}
                        >
                          {b.id}
                        </MUILink>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={b.status} t={t} />
                      </TableCell>
                      <TableCell>{formatDate(b.startedAt, locale)}</TableCell>
                      <TableCell>{b.finishedAt ? formatDate(b.finishedAt, locale) : '—'}</TableCell>
                      <TableCell>{formatDuration(b.duration)}</TableCell>
                      <TableCell>{b.platform ?? '—'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => openBuildMenu(e, b.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={closeBuildMenu}
            >
              <MenuItem
                onClick={() => {
                  if (menuBuildId) router.push(`/projects/${slugForMenu}/builds/${menuBuildId}/logs`);
                  closeBuildMenu();
                }}
              >
                {t('build_list.view_logs') ?? 'Voir les logs'}
              </MenuItem>
            </Menu>
        </Paper>
      </Box>
    </Box>
  );
}
