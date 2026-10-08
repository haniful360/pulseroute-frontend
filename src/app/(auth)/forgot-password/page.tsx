import React from 'react';
import type { Metadata } from 'next';
import ForgotPasswordView from './_components/ForgotPasswordView';

export const metadata: Metadata = {
  title: 'Forgot Password — Reset Account Access',
  description:
    'Request a secure 6-digit verification code to reset your PulseRoute patient or driver account password.',
  alternates: {
    canonical: '/forgot-password',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Forgot Password — PulseRoute Emergency Dispatch',
    description: 'Request a password reset code for your PulseRoute account.',
    url: '/forgot-password',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Password Reset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password — PulseRoute Emergency Dispatch',
    description: 'Request a password reset code for your PulseRoute account.',
    images: ['/images/hero-map.png'],
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
