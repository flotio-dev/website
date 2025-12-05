"use client";

import {
    Box,
    Typography,
    Stack,
    Paper,
    Chip,
    Breadcrumbs,
    Link as MUILink,
    Skeleton,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopIcon from "@mui/icons-material/Stop";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useParams } from "next/navigation";
import { getTranslations } from "@/lib/clientTranslations";
import ProjectSubMenu from "@/app/components/ProjectSubMenu";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import clientApi from "@/lib/utils";

/*******************
 * Types
 *******************/
interface BuildInfo {
    id: number;
    status: "pending" | "running" | "success" | "failed" | "cancelled";
    platform: string;
    created_at: string;
    updated_at: string;
    duration?: number;
    apk_url?: string;
}

interface SyncResponse {
    logs: string[];
    last_line: number;
    status: string;
    pod_status?: string;
    has_more: boolean;
    elapsed_time?: number;
}

/*******************
 * Helper functions
 *******************/
const getPreferredLocale = (p?: string | null) => {
    try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
        if (stored === "en" || stored === "fr") return stored;
    } catch { }
    if (!p) return "fr";
    const parts = p.split("/");
    const candidate = parts[1];
    if (candidate === "en" || candidate === "fr") return candidate;
    return "fr";
};

const formatDate = (iso?: string, locale = "fr") => {
    if (!iso) return "—";
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

// Generate a unique connection ID
const generateConnectionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/*******************
 * Status chip component
 *******************/
function BuildStatusChip({
    status,
    t,
}: {
    status: BuildInfo["status"];
    t: (k: string) => string;
}) {
    const map: Record<
        BuildInfo["status"],
        { icon: React.ReactNode; label: string; color: "success" | "error" | "warning" | "default" | "primary"}
    > = {
        success: {
            icon: <CheckCircleIcon fontSize="small" />,
            label: t("build_details.succeeded") || "Succeeded",
            color: "success",
        },
        failed: {
            icon: <CancelIcon fontSize="small" />,
            label: t("build_details.failed") || "Failed",
            color: "error",
        },
        running: {
            icon: <ScheduleIcon fontSize="small" />,
            label: t("build_details.running") || "Running",
            color: "primary",
        },
        pending: {
            icon: <ScheduleIcon fontSize="small" />,
            label: t("build_details.pending") || "Pending",
            color: "default",
        },
        cancelled: {
            icon: <CancelIcon fontSize="small" />,
            label: t("build_details.cancelled") || "Cancelled",
            color: "default",
        },
    };
    const { icon, label, color } = map[status] ?? map.pending;
    return (
        <Chip
            icon={icon as any}
            label={label}
            color={color}
            size="small"
            variant={status === "running" ? "outlined" : "filled"}
        />
    );
}

/*******************
 * Page
 *******************/
export default function BuildLogsPage() {
    const pathname = usePathname() ?? "/";
    const params = useParams() as { slug?: string; buildId?: string } | undefined;

    const pathParts = pathname.split("/").filter(Boolean);
    const slugForMenu = params?.slug ?? pathParts[1] ?? "project";
    const buildId = params?.buildId ?? "";
    const projectId = params?.slug ?? "";

    const { token } = useAuth();
    const { addToast } = useToast();

    const [locale, setLocale] = useState<"fr" | "en">(() => getPreferredLocale(pathname) as "fr" | "en");
    const [translations, setTranslations] = useState<Record<string, any> | null>(null);
    const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [pollingError, setPollingError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number | null>(null);

    const logsContainerRef = useRef<HTMLDivElement | null>(null);
    const pollingAbortRef = useRef<AbortController | null>(null);
    const connectionIdRef = useRef<string>(generateConnectionId());
    const lastLineRef = useRef<number>(0);

    // Translation helper
    const t = useCallback(
        (key: string) => {
            if (!translations) return key;
            const parts = key.split(".");
            let cur: any = translations;
            for (const p of parts) {
                if (cur && typeof cur === "object" && p in cur) cur = cur[p];
                else return key;
            }
            return typeof cur === "string" ? cur : key;
        },
        [translations]
    );

    // Load translations
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

    // Locale change listener
    useEffect(() => {
        const onLocaleChanged = (e: CustomEvent<string> | null) => {
            const newLoc =
                e?.detail ?? (typeof window !== "undefined" ? localStorage.getItem("lang") : null);
            if (newLoc === "en" || newLoc === "fr") setLocale(newLoc);
        };

        window.addEventListener("localeChanged", onLocaleChanged as EventListener);
        const onStorage = () => onLocaleChanged(null);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("localeChanged", onLocaleChanged as EventListener);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    // Fetch initial build info and logs
    useEffect(() => {
        if (!projectId || !buildId) return;

        const fetchBuildInfo = async () => {
            setLoading(true);
            try {
                // Fetch build info from API
                const buildData = await clientApi<{ build: BuildInfo }>(
                    `project/${projectId}/build/${buildId}`
                );
                if (buildData?.build) {
                    setBuildInfo({
                        id: buildData.build.id,
                        status: buildData.build.status as BuildInfo["status"],
                        platform: buildData.build.platform,
                        created_at: buildData.build.created_at,
                        updated_at: buildData.build.updated_at,
                        duration: buildData.build.duration,
                        apk_url: buildData.build.apk_url,
                    });
                }

                // Fetch build logs (initial)
                const logsData = await clientApi<{ logs: string[] }>(
                    `project/${projectId}/build/${buildId}/logs`
                );
                const initialLogs = logsData?.logs ?? [];
                setLogs(initialLogs);
                lastLineRef.current = initialLogs.length;
            } catch (err: any) {
                console.error("Failed to fetch build info", err);
                addToast({
                    message: err?.message || "Failed to fetch build info",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBuildInfo();
    }, [projectId, buildId, addToast]);

    // HTTP polling for live logs (replaces WebSocket)
    useEffect(() => {
        if (!projectId || !buildId || !token || loading) return;

        let isCancelled = false;

        const pollLogs = async () => {
            // Create new abort controller for this poll cycle
            pollingAbortRef.current = new AbortController();

            try {
                setIsPolling(true);
                setPollingError(null);

                const response = await clientApi<SyncResponse>(
                    `project/${projectId}/build/${buildId}/logs/sync?connectionId=${connectionIdRef.current}&lastLine=${lastLineRef.current}`
                );

                if (isCancelled) return;

                // Append new logs
                if (response?.logs && response.logs.length > 0) {
                    setLogs((prev) => [...prev, ...response.logs]);
                    lastLineRef.current = response.last_line;

                    // Auto-scroll to bottom
                    if (logsContainerRef.current) {
                        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                    }
                }

                // Update build status from response
                if (response?.status) {
                    setBuildInfo((prev) => prev ? {
                        ...prev,
                        status: response.status as BuildInfo["status"]
                    } : prev);
                }

                // Update elapsed time from response
                if (response?.elapsed_time != null) {
                    setElapsedTime(response.elapsed_time);
                }

                // Continue polling if build is still running
                if (response?.has_more && !isCancelled) {
                    // Small delay before next poll to prevent tight loops
                    setTimeout(pollLogs, 100);
                } else {
                    setIsPolling(false);
                }
            } catch (err: any) {
                if (isCancelled) return;

                console.error("Polling error:", err);
                setPollingError(err?.message || "Connection error");
                setIsPolling(false);

                // Retry after 3 seconds on error if build is still running
                if (buildInfo?.status === "running" || buildInfo?.status === "pending") {
                    setTimeout(pollLogs, 3000);
                }
            }
        };

        // Start polling
        pollLogs();

        return () => {
            isCancelled = true;
            if (pollingAbortRef.current) {
                pollingAbortRef.current.abort();
            }
        };
    }, [projectId, buildId, token, loading, buildInfo?.status]);

    // Auto-scroll logs when new logs arrive
    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Cancel build handler
    const handleCancelBuild = async () => {
        if (!projectId || !buildId) return;

        try {
            await clientApi(`project/${projectId}/build/${buildId}/cancel`, {
                method: "PUT",
            });
            addToast({ message: t("build_details.build_cancelled") || "Build cancelled", type: "success" });
            setBuildInfo((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
        } catch (err: any) {
            console.error("Failed to cancel build", err);
            addToast({ message: err?.message || "Failed to cancel build", type: "error" });
        }
    };

    // Refresh logs
    const handleRefreshLogs = async () => {
        if (!projectId || !buildId) return;

        try {
            const logsData = await clientApi<{ logs: string[] }>(
                `project/${projectId}/build/${buildId}/logs`
            );
            setLogs(logsData?.logs ?? []);
            addToast({ message: t("build_details.logs_refreshed") || "Logs refreshed", type: "success" });
        } catch (err: any) {
            console.error("Failed to refresh logs", err);
            addToast({ message: err?.message || "Failed to refresh logs", type: "error" });
        }
    };

    if (loading) {
        return (
            <Box className="flex h-screen">
                <ProjectSubMenu slug={slugForMenu} />
                <Box className="flex-1 overflow-auto" sx={{ p: 6, bgcolor: "background.default" }}>
                    <Stack spacing={2}>
                        <Skeleton variant="rectangular" height={48} />
                        <Skeleton variant="rectangular" height={400} />
                    </Stack>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="flex h-screen">
            <ProjectSubMenu slug={slugForMenu} />

            <Box className="flex-1 overflow-auto" sx={{ p: 6, bgcolor: "background.default" }}>
                {/* Header */}
                <Stack spacing={1} mb={4}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <MUILink underline="hover" color="inherit" href="/projects">
                            {t("project_page.projects")}
                        </MUILink>
                        <MUILink underline="hover" color="inherit" href={`/projects/${slugForMenu}/overview`}>
                            {slugForMenu}
                        </MUILink>
                        <MUILink underline="hover" color="inherit" href={`/projects/${slugForMenu}/builds`}>
                            {t("project_page.builds") || "Builds"}
                        </MUILink>
                        <Typography color="text.primary">
                            {t("build_details.title") || "Build"} #{buildId}
                        </Typography>
                    </Breadcrumbs>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="h5" color="text.primary">
                                {t("build_details.title") || "Build"} #{buildId}
                            </Typography>
                            {buildInfo && <BuildStatusChip status={buildInfo.status} t={t} />}
                            {isPolling && (
                                <Chip
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    label={t("build_details.live") || "Live"}
                                    icon={<CircularProgress size={12} color="inherit" />}
                                />
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <Tooltip title={t("build_details.refresh_logs") || "Refresh logs"}>
                                <IconButton onClick={handleRefreshLogs}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            {(buildInfo?.status === "running" || buildInfo?.status === "pending") && (
                                <Tooltip title={t("build_details.cancel_build") || "Cancel build"}>
                                    <IconButton onClick={handleCancelBuild} color="error">
                                        <StopIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    </Stack>

                    {buildInfo && (
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                {t("build_details.platform") || "Platform"}: {buildInfo.platform}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t("build_details.started_at") || "Started"}: {formatDate(buildInfo.created_at, locale)}
                            </Typography>
                            {(elapsedTime != null || (buildInfo.duration != null && buildInfo.duration > 0)) && (
                                <Typography variant="body2" color="text.secondary">
                                    {t("build_details.duration") || "Duration"}: {Math.floor((elapsedTime ?? buildInfo.duration ?? 0) / 60)}m {(elapsedTime ?? buildInfo.duration ?? 0) % 60}s
                                </Typography>
                            )}
                        </Stack>
                    )}

                    {pollingError && (
                        <Chip
                            size="small"
                            color="error"
                            label={pollingError}
                            onDelete={() => setPollingError(null)}
                        />
                    )}
                </Stack>

                {/* Logs */}
                <Paper
                    ref={logsContainerRef}
                    sx={(theme) => ({
                        p: 2,
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
                        color: theme.palette.mode === "dark" ? "grey.100" : "grey.900",
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 300px)",
                        minHeight: 400,
                    })}
                >
                    {logs.length === 0 ? (
                        <Typography color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {buildInfo?.status === "pending"
                                ? t("build_details.waiting_for_logs") || "Waiting for logs..."
                                : t("build_details.no_logs") || "No logs available"}
                        </Typography>
                    ) : (
                        logs.map((line, idx) => (
                            <Box key={idx} sx={{ py: 0.25 }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                        mr: 2,
                                        userSelect: "none",
                                    }}
                                >
                                    {String(idx + 1).padStart(4, " ")}
                                </Typography>
                                <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                                    {line}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
