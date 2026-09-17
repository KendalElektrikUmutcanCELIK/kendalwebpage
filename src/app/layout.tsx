import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
import { GsapContext } from '@/components/engine/GsapContext';
import { SmoothScrollProvider } from '@/components/engine/SmoothScrollProvider';
import { OrganizationSchema } from '@/components/shared/OrganizationSchema';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { getAssetPath } from '@/lib/basePath';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { LightTemperatureProvider } from '@/lib/LightTemperatureProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kendalelektrik.com'),
  title: 'Kendal Elektrik - Global Manufacturer Since 1997',
  description: 'Innovative lighting and electrical equipment.',
  icons: {
    icon: getAssetPath('/kendal-icon.png'),
    apple: getAssetPath('/kendal-icon.png'),
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'GdN0-v59rFupmT2YoIoW9POqdeETaaK4UHmgd2M23ko',
  },
  openGraph: {
    title: 'Kendal Elektrik - Global Manufacturer',
    description: 'Innovative lighting and electrical equipment.',
    type: 'website',
    url: '/',
    images: [
      {
        url: getAssetPath('/images/factory-bg.webp'),
        width: 1271,
        height: 881,
      },
    ],
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased transition-colors duration-200`}
        suppressHydrationWarning
      >
        <Script id="chatbot-accent-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var host = window.location.hostname;
                var key = 'main';
                if (host.indexOf('k2') === 0) key = 'k2';
                else if (host.indexOf('vanti') === 0) key = 'vanti';
                else if (host.indexOf('global') === 0) key = 'global';
                else {
                  var m = window.location.pathname.match(/\\/brand\\/(k2|vanti|global)(?:\\/|$)/);
                  if (m) key = m[1];
                }
                var colors = {
                  main: ['#E3000F', '#ffffff', 'rgba(227,0,15,0.45)'],
                  k2: ['#f97316', '#ffffff', 'rgba(249,115,22,0.45)'],
                  vanti: ['#2563eb', '#ffffff', 'rgba(37,99,235,0.45)'],
                  global: ['#FFDA51', '#1c1917', 'rgba(255,218,81,0.45)']
                };
                var c = colors[key];
                var root = document.documentElement.style;
                root.setProperty('--chatbot-bg', c[0]);
                root.setProperty('--chatbot-text', c[1]);
                root.setProperty('--chatbot-glow', c[2]);
              } catch (e) {}
            })();
          `}
        </Script>
        <LanguageProvider>
          <SmoothScrollProvider>
            <LightTemperatureProvider>
              <GsapContext>
                <OrganizationSchema />
                <CustomCursor />
                {children}
                <ChatbotWidget />
              </GsapContext>
            </LightTemperatureProvider>
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
