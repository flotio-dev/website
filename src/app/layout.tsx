import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import "./globals.css";

import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { AuthProvider } from "@/lib/hooks/useAuth";
import ToastContainer from "./components/ToastContainer";
import { ToastProvider } from "@/lib/hooks/useToast";
import ThemeModeProvider from "./providers/ThemeModeProvider";

// Charger la font Roboto via next/font
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Flotio",
  description: "Deploy and manage your projects easily",
   icons: {
    icon: "/ico.jpg",
  },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeModeProvider>
              <ToastProvider>
                {children}
                <ToastContainer />
              </ToastProvider>
            </ThemeModeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
