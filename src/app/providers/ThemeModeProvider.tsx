"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark" | "system";

type Ctx = {
  mode: ThemeMode;
  resolvedMode: "light" | "dark"; 
  setMode: (m: ThemeMode) => void;
  toggle: () => void; // light <-> dark (ignore "system")
};

const ThemeModeContext = createContext<Ctx>({
  mode: "system",
  resolvedMode: "light",
  setMode: () => {},
  toggle: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setMode(stored);
    }
    setMounted(true);
  }, []);

  const resolvedMode: "light" | "dark" =
    mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
  }, [mode, resolvedMode, mounted]);

  const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  const ctxValue: Ctx = {
    mode,
    resolvedMode,
    setMode,
    toggle,
  };

  if (!mounted) {
    return (
      <ThemeModeContext.Provider value={ctxValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    );
  }

  return (
    <ThemeModeContext.Provider value={ctxValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
