import React from 'react';
import { JoinDriverHero } from './_components/JoinDriverHero';
import { JoinDriverBenefits } from './_components/JoinDriverBenefits';
import { JoinDriverSteps } from './_components/JoinDriverSteps';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as an Ambulance Driver Partner — PulseRoute Crew Network',
  description:
    'Drive with purpose, earn with pride. Partner your ambulance with PulseRoute: instant wallet payouts, transparent 12% commission, and steady emergency dispatch volume.',
  keywords: [
    'Ambulance driver jobs',
    'Register ambulance vehicle',
    'Ambulance driver recruitment Bangladesh',
    'PulseRoute driver portal',
    'Earn money ambulance driver',
  ],
  alternates: {
    canonical: '/join-driver',
  },
  openGraph: {
    title: 'Join as an Ambulance Driver Partner — PulseRoute',
    description:
      'Partner your ambulance with the premier dispatch network in Bangladesh. Fair 12% commission, digital payouts, and dignified emergency work.',
    url: '/join-driver',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/join-driver-hero.png',
        width: 1200,
        height: 630,
        alt: 'Join PulseRoute Ambulance Driver Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join as an Ambulance Driver Partner — PulseRoute',
    description:
      'Partner your ambulance with the premier dispatch network in Bangladesh. Fair 12% commission, digital payouts, and dignified emergency work.',
    images: ['/images/join-driver-hero.png'],
  },
};

export default function JoinDriverPage() {
  return (
    <div className="flex w-full flex-col">
      <JoinDriverHero />
      <JoinDriverBenefits />
      <JoinDriverSteps />
    </div>
  );
}
