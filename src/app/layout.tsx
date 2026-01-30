import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeModeProvider } from '@/components/preferences/ThemeModeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mon Application',
  description: 'Application Next.js avec MUI et i18n',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            {children}
          </ThemeModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
