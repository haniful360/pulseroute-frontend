import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ResetPasswordView from './_components/ResetPasswordView';

export const metadata: Metadata = {
  title: 'Set New Password — PulseRoute Account Recovery',
  description:
    'Enter your verification code and set a strong new password for your PulseRoute account.',
  alternates: {
    canonical: '/reset-password',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Reset Password — PulseRoute Emergency Dispatch',
    description: 'Set a new password to restore your account access.',
    url: '/reset-password',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Reset Password',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reset Password — PulseRoute Emergency Dispatch',
    description: 'Set a new password to restore your account access.',
    images: ['/images/hero-map.png'],
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
}
