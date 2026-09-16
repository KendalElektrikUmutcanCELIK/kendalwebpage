import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
