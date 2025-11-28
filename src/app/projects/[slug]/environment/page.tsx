"use client";

import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Breadcrumbs,
  Link as MUILink,
  Grid,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudIcon from "@mui/icons-material/Cloud";
import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { getTranslations } from "../../../../lib/clientTranslations";
import ProjectSubMenu from "../../../components/ProjectSubMenu";

/*******************
 * Types & mocks
 *******************/
type EnvId = "development" | "preview" | "production";
type EnvStatus = "healthy" | "degraded" | "down";

interface Environment {
  id: EnvId;
  nameKey: string;      // ex: environment_page.development
  url: string;
  branch: string;
  status: EnvStatus;
  lastDeployAt: string;
  lastDeployBy: string;
}

interface DeployItem {
  id: string;
  env: EnvId;
  status: EnvStatus;
  commit: string;
  author: string;
  at: string;
}

const mockEnvironments: Environment[] = [
  {
    id: "development",
    nameKey: "environment_page.development",
    url: "https://dev.example.com",
    branch: "develop",
    status: "healthy",
    lastDeployAt: "2025-10-19T21:21:00Z",
    lastDeployBy: "dev-user",
  },
  {
    id: "preview",
    nameKey: "environment_page.preview",
    url: "https://preview.example.com",
    branch: "feature/new-ui",
    status: "degraded",
    lastDeployAt: "2025-10-18T16:02:00Z",
    lastDeployBy: "reviewer",
  },
  {
    id: "production",
    nameKey: "environment_page.production",
    url: "https://app.example.com",
    branch: "main",
    status: "healthy",
    lastDeployAt: "2025-10-17T09:45:00Z",
    lastDeployBy: "release-bot",
  },
];

const mockDeploys: DeployItem[] = [
  {
    id: "deploy_101",
    env: "production",
    status: "healthy",
    commit: "26c00b2",
    author: "release-bot",
    at: "2025-10-17T09:45:00Z",
  },
  {
    id: "deploy_100",
    env: "preview",
    status: "degraded",
    commit: "8cdd761",
    author: "reviewer",
    at: "2025-10-18T16:02:00Z",
  },
  {
    id: "deploy_099",
    env: "development",
    status: "healthy",
    commit: "2169c6e",
    author: "dev-user",
    at: "2025-10-19T21:21:00Z",
  },
];

/*******************
 * Locale helpers
 *******************/
const getPreferredLocale = (p?: string | null) => {
  try {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "en" || stored === "fr") return stored;
  } catch {}
  if (!p) return "fr";
  const parts = p.split("/");
  const candidate = parts[1];
  if (candidate === "en" || candidate === "fr") return candidate;
  return "fr";
};

const formatDateTime = (iso: string, locale: string) => {
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

/*******************
 * Status chip
 *******************/
function EnvStatusChip({
  status,
  t,
}: {
  status: EnvStatus;
  t: (k: string) => string;
}) {
  const map: Record<
    EnvStatus,
    { icon: React.ReactNode; color: "success" | "warning" | "error"; label: string }
  > = {
    healthy: {
      icon: <CheckCircleIcon fontSize="small" />,
      color: "success",
      label: t("environment_page.status_healthy"),
    },
    degraded: {
      icon: <ReportProblemIcon fontSize="small" />,
      color: "warning",
      label: t("environment_page.status_degraded"),
    },
    down: {
      icon: <CancelIcon fontSize="small" />,
      color: "error",
      label: t("environment_page.status_down"),
    },
  };

  const { icon, color, label } = map[status];
  return <Chip icon={icon as any} label={label} color={color} size="small" />;
}

/*******************
 * Page
 *******************/
export default function EnvironmentsPage() {
  const pathname = usePathname() ?? "/";
  const params = useParams() as { slug?: string } | undefined;

  const pathParts = pathname.split("/").filter(Boolean);
  const candidateSlugFromPath = params?.slug ?? pathParts[1] ?? pathParts[0];
  const slugForMenu = candidateSlugFromPath ?? "project";

  const [locale, setLocale] = useState<"fr" | "en">(
    () => getPreferredLocale(pathname) as "fr" | "en"
  );
  const [translations, setTranslations] = useState<Record<string, any> | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    const load = async (loc: string) => {
      const json = await getTranslations(loc);
      if (mounted) setTranslations(json);
    };
    load(locale);

    const onLocaleChanged = (e: any) => {
      const newLoc =
        e?.detail ??
        (typeof window !== "undefined" ? localStorage.getItem("lang") : null);
      if (newLoc === "en" || newLoc === "fr") setLocale(newLoc);
    };

    window.addEventListener("localeChanged", onLocaleChanged as EventListener);
    const onStorage = () => onLocaleChanged(null);
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener(
        "localeChanged",
        onLocaleChanged as EventListener
      );
      window.removeEventListener("storage", onStorage);
    };
  }, [locale, pathname]);

  const t = (key: string) => {
    if (!translations) return key;
    const parts = key.split(".");
    let cur: any = translations;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p];
      else return key;
    }
    return typeof cur === "string" ? cur : key;
  };

  return (
    <Box className="flex h-screen">
      {/* Sidebar projet */}
      <ProjectSubMenu slug={slugForMenu} />

      {/* Main content */}
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
              {t("environment_page.title") || "Environments"}
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <CloudIcon color="primary" />
            <Typography variant="h5" color="text.primary">
              {t("environment_page.title") || "Environments"}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t("environment_page.subtitle") ||
              "Configure and monitor your development, preview, and production environments."}
          </Typography>
        </Stack>

        {/* Environments cards */}
        <Grid container spacing={2} mb={4}>
          {mockEnvironments.map((env) => (
              <Paper
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: "background.paper",
                  p: 2,
                  height: "100%",
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" color="text.primary">
                      {t(env.nameKey) || env.id}
                    </Typography>
                    <EnvStatusChip status={env.status} t={t} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {t("environment_page.branch") || "Branch"}:{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {env.branch}
                    </Typography>
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {t("environment_page.url") || "URL"}:
                    </Typography>
                    <MUILink
                      href={env.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {env.url}
                    </MUILink>
                    <Tooltip title={t("environment_page.open_env") || "Open"}>
                      <IconButton
                        size="small"
                        href={env.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {t("environment_page.last_deploy") || "Last deploy"}:{" "}
                    {formatDateTime(env.lastDeployAt, locale)} ·{" "}
                    {t("environment_page.by") || "by"} {env.lastDeployBy}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t("environment_page.manage_variables") || "Environment variables"}
                      component="a"
                      href={`/projects/${slugForMenu}/env-variables?env=${env.id}`}
                      clickable
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t("environment_page.view_builds") || "View builds"}
                      component="a"
                      href={`/projects/${slugForMenu}/builds?env=${env.id}`}
                      clickable
                    />
                  </Stack>
                </Stack>
              </Paper>
          ))}
        </Grid>

        {/* Deploy history table */}
        <Paper
          className="rounded-xl shadow-sm"
          sx={{ p: 2, bgcolor: "background.paper" }}
        >
          <Typography variant="h6" color="text.primary" mb={2}>
            {t("environment_page.recent_deploys") || "Recent deploys"}
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("environment_page.deploy_id") || "ID"}</TableCell>
                  <TableCell>
                    {t("environment_page.environment") || "Environment"}
                  </TableCell>
                  <TableCell>{t("environment_page.status") || "Status"}</TableCell>
                  <TableCell>{t("environment_page.commit") || "Commit"}</TableCell>
                  <TableCell>{t("environment_page.author") || "Author"}</TableCell>
                  <TableCell>{t("environment_page.date") || "Date"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockDeploys.map((d) => {
                  const env = mockEnvironments.find((e) => e.id === d.env);
                  return (
                    <TableRow
                      key={d.id}
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
                      <TableCell>{d.id}</TableCell>
                      <TableCell>
                        {env ? t(env.nameKey) || env.id : d.env}
                      </TableCell>
                      <TableCell>
                        <EnvStatusChip status={d.status} t={t} />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {d.commit}
                        </Typography>
                      </TableCell>
                      <TableCell>{d.author}</TableCell>
                      <TableCell>{formatDateTime(d.at, locale)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}
