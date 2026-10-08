import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './_components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Patient & Driver Portal',
  description:
    'Sign in to your PulseRoute account to book emergency medical transport, track ambulances live, or access the crew dispatch console.',
  keywords: [
    'PulseRoute login',
    'Ambulance portal login',
    'Driver dispatch login',
    'Patient emergency portal',
  ],
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Sign In — PulseRoute Emergency Dispatch Portal',
    description:
      'Access your PulseRoute account for instant ambulance bookings, live telemetry, and driver dispatch management.',
    url: '/login',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Login Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In — PulseRoute Emergency Dispatch Portal',
    description:
      'Access your PulseRoute account for instant ambulance bookings, live telemetry, and driver dispatch management.',
    images: ['/images/hero-map.png'],
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
