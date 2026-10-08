import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulseroute.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PulseRoute | Emergency Medical & Ambulance Dispatch Platform',
    template: '%s | PulseRoute',
  },
  description:
    'Next-generation emergency ambulance dispatch network with real-time GPS telemetry, certified paramedic care, and transparent upfront pricing across Bangladesh.',
  applicationName: 'PulseRoute',
  authors: [{ name: 'PulseRoute Medical Technologies', url: siteUrl }],
  creator: 'PulseRoute Team',
  publisher: 'PulseRoute Health Logistics',
  keywords: [
    'Ambulance Bangladesh',
    'Emergency Dispatch Dhaka',
    'ICU Ambulance',
    'CCU Ambulance',
    'Neonatal Ambulance NICU',
    'Emergency Medical Response',
    'PulseRoute',
    'Paramedic Service',
    'Online Ambulance Booking',
    'Freezer Ambulance Van',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PulseRoute | Emergency Medical & Ambulance Dispatch Platform',
    description:
      'Next-generation emergency ambulance dispatch network with real-time GPS telemetry, certified paramedic care, and transparent upfront pricing.',
    url: siteUrl,
    siteName: 'PulseRoute',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Emergency Ambulance Dispatch Radar & Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseRoute | Emergency Medical & Ambulance Dispatch Platform',
    description:
      'Next-generation emergency ambulance dispatch network with real-time GPS telemetry, certified paramedic care, and transparent upfront pricing.',
    images: ['/images/hero-map.png'],
    creator: '@pulseroute',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} max-w-screen overflow-x-hidden font-sans antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster richColors position="top-right" />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

