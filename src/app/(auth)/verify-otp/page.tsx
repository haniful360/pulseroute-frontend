import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import VerifyOtpView from './_components/VerifyOtpView';

export const metadata: Metadata = {
  title: 'Verify Account OTP — PulseRoute Security',
  description:
    'Confirm your registered email address with the 6-digit one-time password to complete your PulseRoute account setup.',
  alternates: {
    canonical: '/verify-otp',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Verify Account OTP — PulseRoute Emergency Dispatch',
    description: 'Enter your 6-digit verification code to activate your account.',
    url: '/verify-otp',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Account Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verify Account OTP — PulseRoute Emergency Dispatch',
    description: 'Enter your 6-digit verification code to activate your account.',
    images: ['/images/hero-map.png'],
  },
};

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <VerifyOtpView />
    </Suspense>
  );
}
