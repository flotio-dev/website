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
        { icon: React.ReactNode; label: string; color: "success" | "error" | "warning" | "default" }
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
            color: "warning",
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
    const [wsConnected, setWsConnected] = useState(false);
    const [wsError, setWsError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const logsContainerRef = useRef<HTMLDivElement | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                // Fetch build logs (initial)
                const logsData = await clientApi<{ logs: string[] }>(
                    `project/${projectId}/build/${buildId}/logs`
                );
                setLogs(logsData?.logs ?? []);

                // We don't have a specific endpoint for build info, but we can get it from the project
                // For now, we'll use the build ID to display basic info
                setBuildInfo({
                    id: parseInt(buildId, 10),
                    status: "running", // Will be updated via WebSocket or polling
                    platform: "android",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
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

    // WebSocket connection for live logs
    useEffect(() => {
        if (!projectId || !buildId || !token) return;

        const connectWebSocket = () => {
            // Clean up previous connection
            if (wsRef.current) {
                wsRef.current.close();
            }

            // Build WebSocket URL
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
            const wsHost = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
            const wsUrl = `${wsProtocol}://${wsHost}/project/${projectId}/build/${buildId}/logs/ws?token=${encodeURIComponent(token)}`;

            console.log("Connecting to WebSocket:", wsUrl);

            try {
                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("WebSocket connected");
                    setWsConnected(true);
                    setWsError(null);
                };

                ws.onmessage = (event) => {
                    const logLine = event.data;
                    setLogs((prev) => [...prev, logLine]);

                    // Auto-scroll to bottom
                    if (logsContainerRef.current) {
                        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                    }
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setWsError("WebSocket connection error");
                    setWsConnected(false);
                };

                ws.onclose = (event) => {
                    console.log("WebSocket closed:", event.code, event.reason);
                    setWsConnected(false);

                    // Check if build is still running and reconnect
                    if (buildInfo?.status === "running" || buildInfo?.status === "pending") {
                        // Reconnect after 3 seconds
                        reconnectTimeoutRef.current = setTimeout(() => {
                            console.log("Attempting to reconnect WebSocket...");
                            connectWebSocket();
                        }, 3000);
                    }
                };
            } catch (err) {
                console.error("Failed to create WebSocket:", err);
                setWsError("Failed to connect to log stream");
            }
        };

        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [projectId, buildId, token, buildInfo?.status]);

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
                            {wsConnected && (
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
                            {buildInfo.duration && (
                                <Typography variant="body2" color="text.secondary">
                                    {t("build_details.duration") || "Duration"}: {buildInfo.duration}s
                                </Typography>
                            )}
                        </Stack>
                    )}

                    {wsError && (
                        <Chip
                            size="small"
                            color="error"
                            label={wsError}
                            onDelete={() => setWsError(null)}
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
