import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { UserDetailsProvider } from '../context/UserDetailsContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SystemConfigProvider } from '../context/SystemConfigContext';
import { PwaRegister } from '../components/common/PwaRegister';
import { NavigationTracker } from '../components/common/NavigationTracker';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'StudyCord',
  description: 'StudyCord - Interactive quizzes, multiplayer battles, tournaments, and knowledge rewards.',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/config/app_logo.svg',
    apple: '/assets/config/app_logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StudyCord',
  },
};

export const viewport: Viewport = {
  themeColor: '#ef5388',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${nunito.className}`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/assets/config/app_logo.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${nunito.className} font-nunito antialiased min-h-screen`} suppressHydrationWarning>
        <PwaRegister />
        <NavigationTracker />
        <ThemeProvider>
          <AuthProvider>
            <UserDetailsProvider>
              <SettingsProvider>
                <SystemConfigProvider>
                  {children}
                </SystemConfigProvider>
              </SettingsProvider>
            </UserDetailsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
