import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SuperAdminLoginForm from './_components/SuperAdminLoginForm';

export const metadata: Metadata = {
  title: 'Super Administrator Master Control — PulseRoute Console',
  description:
    'Restricted root terminal access for PulseRoute platform operations, global fleet matrix, and master dispatch governance.',
  alternates: {
    canonical: '/super-admin/login',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Super Administrator Master Control — PulseRoute',
    description: 'Secure root administrative login for PulseRoute master console.',
    url: '/super-admin/login',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Master Console Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Administrator Master Control — PulseRoute',
    description: 'Secure root administrative login for PulseRoute master console.',
    images: ['/images/hero-map.png'],
  },
};

export default function SuperAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <SuperAdminLoginForm />
    </Suspense>
  );
}
