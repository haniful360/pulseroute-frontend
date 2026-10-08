import React from 'react';
import type { Metadata } from 'next';
import SafetyStandardsPage from '../safety/page';

export const metadata: Metadata = {
  title: 'About PulseRoute — Emergency Response Network & Mission',
  description:
    'PulseRoute is dedicated to eliminating preventable pre-hospital delays across Bangladesh by connecting patients, hospital emergency rooms, and certified ambulance crews.',
  keywords: [
    'About PulseRoute',
    'Ambulance dispatch company Bangladesh',
    'Emergency medical logistics',
    'Pre-hospital emergency care',
    'Healthcare logistics Dhaka',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About PulseRoute — Saving Lives Through Connected Emergency Care',
    description:
      'Learn about our clinician-led mission to modernize pre-hospital emergency transport with real-time telemetry and certified paramedic care.',
    url: '/about',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/safety-mission-hero.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Mission and Medical Operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PulseRoute — Emergency Response Network & Mission',
    description:
      'Learn about our clinician-led mission to modernize pre-hospital emergency transport with real-time telemetry and certified paramedic care.',
    images: ['/images/safety-mission-hero.png'],
  },
};

export default function AboutPage() {
  return <SafetyStandardsPage />;
}
