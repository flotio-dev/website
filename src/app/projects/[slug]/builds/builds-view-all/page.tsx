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
  Breadcrumbs,
  Link as MUILink,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import ProjectSubMenu from "@/app/components/ProjectSubMenu";
import { useLocalization } from "@/lib/hooks/useLocalization";
import clientApi, { clientApiRaw } from '@/lib/utils';
import { useToast } from '@/lib/hooks/useToast';

/*******************
 * Types
 *******************/
interface BuildItem {
  id: string;
  status: "success" | "failed" | "running" | "pending" | "cancelled" | string;
  createdAt: string;
  duration: number;
  platform: string;
}


const formatDate = (iso: string | undefined, locale: string) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
};

const formatDuration = (duration: number) => {
  if (duration <= 0) return '—';
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  return `${mins}m ${secs}s`;
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
  const map: Record<
    string,
    { icon: React.ReactNode; color: 'success' | 'error' | 'default' | 'warning' | 'primary'; label: string }
  > = {
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
      color: "primary",
      label: t("project_page.running"),
    },
    pending: {
      icon: <ScheduleIcon fontSize="small" />,
      color: "warning",
      label: t("project_page.pending") ?? "Pending",
    },
    cancelled: {
      icon: <CancelIcon fontSize="small" />,
      color: "default",
      label: t("project_page.cancelled") ?? "Cancelled",
    },
  };
  const config = map[status] ?? map.pending;
  const { icon, color, label } = config;
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

/*******************
 * Page
 *******************/
export default function BuildListPage() {
  const [filter, setFilter] = useState("");
  const pathname = usePathname() ?? "/";
  const params = useParams() as { slug?: string } | undefined;
  const { addToast } = useToast();

  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBuildId, setDeleteBuildId] = useState<string | null>(null);
  const [deletingBuild, setDeletingBuild] = useState(false);

  // Download state
  const [downloadingBuildId, setDownloadingBuildId] = useState<string | null>(null);

  // slug pour le sous-menu projet
  const pathParts = pathname.split("/").filter(Boolean);
  const candidateSlugFromPath = params?.slug ?? pathParts[1] ?? pathParts[0];
  const slugForMenu = candidateSlugFromPath ?? "project";
  const idOrSlug = candidateSlugFromPath;

  const { locale, t } = useLocalization();

  // Fetch builds
  useEffect(() => {
    let mounted = true;
    if (!idOrSlug) return;
    const fetchBuilds = async () => {
      setLoading(true);
      try {
        const res = await clientApi<{ builds: any[] }>(`project/${encodeURIComponent(String(idOrSlug))}/builds`);

        const list = res?.builds ?? [];
        const mapped: BuildItem[] = Array.isArray(list)
          ? list.map((b: any) => ({
              id: String(b.id ?? b.ID ?? ''),
              status: b.status as BuildItem['status'],
              createdAt: b.created_at ?? b.CreatedAt ?? '',
              duration: b.duration ?? 0,
              platform: b.platform ?? '',
            }))
          : [];

        // sort newest first
        mapped.sort((a, b) => {
          const ta = Date.parse(a.createdAt) || 0;
          const tb = Date.parse(b.createdAt) || 0;
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

  // Delete handlers
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
    if (!id || !idOrSlug) return;

    setDeletingBuild(true);
    try {
      const res = await clientApiRaw(`project/${idOrSlug}/build/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to delete build (${res.status})`);
      }

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

  // Download handler
  const handleDownloadApk = async (buildId: string) => {
    if (!idOrSlug) return;

    setDownloadingBuildId(buildId);
    try {
      interface DownloadResponse {
        download_url: string;
      }

      const data = await clientApi<DownloadResponse>(`project/${idOrSlug}/build/${buildId}/download`);

      if (!data.download_url) {
        throw new Error('No download URL in response');
      }

      window.open(data.download_url, '_blank');
      addToast({ message: t('project_page.download_started') ?? 'Download started', type: 'success' });
    } catch (err: any) {
      console.error('Failed to download APK', err);
      addToast({ message: err?.message ?? t('project_page.download_failed') ?? 'Download failed', type: 'error' });
    } finally {
      setDownloadingBuildId(null);
    }
  };

  const filteredBuilds = builds.filter((b) =>
    b.id.toLowerCase().includes(filter.toLowerCase()) ||
    b.platform.toLowerCase().includes(filter.toLowerCase()) ||
    b.status.toLowerCase().includes(filter.toLowerCase())
  );

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
          {loading ? (
            <Stack spacing={1} sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
            </Stack>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{t("project_page.status")}</TableCell>
                    <TableCell>{t("project_page.created_at")}</TableCell>
                    <TableCell>{t("project_page.duration")}</TableCell>
                    <TableCell>{t("project_page.platform")}</TableCell>
                    <TableCell align="right">{t("project_page.actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBuilds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          {t("build_list.no_builds")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBuilds.map((b, i) => (
                      <TableRow
                        key={`${b.id}-${i}`}
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
                        <TableCell>{formatDuration(b.duration)}</TableCell>
                        <TableCell>{b.platform || '—'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            {b.status === 'success' && (
                              <Tooltip title={t('project_page.download_apk') ?? 'Download APK'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadApk(b.id)}
                                  disabled={downloadingBuildId === b.id}
                                >
                                  {downloadingBuildId === b.id ? (
                                    <CircularProgress size={18} />
                                  ) : (
                                    <DownloadIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title={t('project_page.delete') ?? 'Delete'}>
                              <IconButton size="small" onClick={() => openDeleteDialog(b.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Delete confirmation dialog */}
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
      </Box>
    </Box>
  );
}
