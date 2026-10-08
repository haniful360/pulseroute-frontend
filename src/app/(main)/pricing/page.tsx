import React from 'react';
import { PricingHeroSection } from './_components/PricingHeroSection';
import { InteractiveFareCalculator } from './_components/InteractiveFareCalculator';
import { VehicleClassesManifestSection } from './_components/VehicleClassesManifestSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet Pricing & Fare Breakdown — Transparent Ambulance Fares',
  description:
    'Transparent upfront ambulance pricing across Bangladesh. Calculate base fares, per-km rates, and locked dispatch quotes for Basic, AC, ICU, CCU, Neonatal, and Freezer vans.',
  keywords: [
    'Ambulance pricing Bangladesh',
    'ICU ambulance cost Dhaka',
    'Ambulance rate per kilometer',
    'Emergency fare calculator',
    'Transparent healthcare pricing',
  ],
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Fleet Pricing & Transparent Fare Breakdown — PulseRoute',
    description:
      'Zero surprise costs during emergencies. Upfront pricing algorithms for BLS, AC, ICU, CCU, NICU, and Freezer vans.',
    url: '/pricing',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Transparent Fare Structure and Fleet Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleet Pricing & Fare Breakdown — PulseRoute',
    description:
      'Zero surprise costs during emergencies. Upfront pricing algorithms for BLS, AC, ICU, CCU, NICU, and Freezer vans.',
    images: ['/images/hero-map.png'],
  },
};

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col">
      <PricingHeroSection />
      <InteractiveFareCalculator />
      <VehicleClassesManifestSection />
    </div>
  );
}
