import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeModeProvider } from '@/components/preferences/ThemeModeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Flotio — Modern Flutter CI/CD & Cloud Build Platform',
  description: 'Automate your Flutter mobile builds, Android Keystores, Google Play deployments, and Firebase integrations with dedicated cloud runners.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeModeProvider>
            {children}
          </ThemeModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

