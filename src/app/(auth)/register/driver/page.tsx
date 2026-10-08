import React from 'react';
import type { Metadata } from 'next';
import DriverRegisterForm from './_components/DriverRegisterForm';

export const metadata: Metadata = {
  title: 'Driver Partner Registration — Join PulseRoute Crew',
  description:
    'Register your ambulance vehicle and join the PulseRoute dispatch network. Fast approval, competitive earnings, 12% commission, and direct payouts.',
  keywords: [
    'Ambulance driver registration',
    'Join PulseRoute driver',
    'Ambulance partner sign up',
    'Bangladesh ambulance network',
  ],
  alternates: {
    canonical: '/register/driver',
  },
  openGraph: {
    title: 'Driver Partner Registration — Join PulseRoute Crew',
    description:
      'Partner your ambulance with PulseRoute: instant payouts, fair commissions, and high dispatch volume across Bangladesh.',
    url: '/register/driver',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/join-driver-hero.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Driver Partner Registration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Driver Partner Registration — Join PulseRoute Crew',
    description:
      'Partner your ambulance with PulseRoute: instant payouts, fair commissions, and high dispatch volume across Bangladesh.',
    images: ['/images/join-driver-hero.png'],
  },
};

export default function DriverRegisterPage() {
  return <DriverRegisterForm />;
}
