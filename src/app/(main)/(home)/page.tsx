import React from 'react';
import { HeroSection } from './_components/HeroSection';
import { StatsBar } from './_components/StatsBar';
import { VehicleClassesSection } from './_components/VehicleClassesSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { SafetyStandardsSection } from './_components/SafetyStandardsSection';
import { TestimonialsSection } from './_components/TestimonialsSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PulseRoute — Instant Emergency Ambulance Dispatch & Telemetry',
  description:
    'Verified ambulance dispatch network in Bangladesh. Book Basic Life Support, AC, ICU, CCU, Neonatal, and Freezer vans with transparent upfront pricing and live GPS telemetry.',
  keywords: [
    'Ambulance booking Bangladesh',
    'Emergency ambulance Dhaka',
    'ICU ambulance service',
    'Neonatal transport incubator',
    'Cardiac CCU ambulance',
    'Emergency 999 integration',
    'PulseRoute ambulance dispatch',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PulseRoute — Instant Emergency Ambulance Dispatch & Telemetry',
    description:
      'Verified ambulance dispatch network in Bangladesh with transparent upfront pricing, certified paramedic crews, and live GPS telemetry.',
    url: '/',
    siteName: 'PulseRoute',
    type: 'website',
    locale: 'en_US',
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
    title: 'PulseRoute — Instant Emergency Ambulance Dispatch & Telemetry',
    description:
      'Verified ambulance dispatch network in Bangladesh with transparent upfront pricing, certified paramedic crews, and live GPS telemetry.',
    images: ['/images/hero-map.png'],
  },
};

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <StatsBar />
      <VehicleClassesSection />
      <HowItWorksSection />
      <SafetyStandardsSection />
      <TestimonialsSection />
    </div>
  );
}
