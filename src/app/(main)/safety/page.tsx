import React from 'react';
import { HeldStandardsSection } from './_components/HeldStandardsSection';
import { MedicalAdvisoryBoardSection } from './_components/MedicalAdvisoryBoardSection';
import { MissionVisionSection } from './_components/MissionVisionSection';
import { SafetyHeroSection } from './_components/SafetyHeroSection';
import { TimelineSection } from './_components/TimelineSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinical Safety Standards & Medical Governance — PulseRoute',
  description:
    'Clinician-audited protocols, verifiable vehicle sanitation standards, defibrillator checks, and real-time biometric telemetry across Bangladesh.',
  keywords: [
    'Ambulance safety protocols',
    'Pre-hospital clinical governance',
    'Ambulance sanitation standards',
    'Paramedic clinical board',
    'Medical advisory Bangladesh',
  ],
  alternates: {
    canonical: '/safety',
  },
  openGraph: {
    title: 'Clinical Safety Standards & Governance — PulseRoute',
    description:
      'Explore our hospital-grade sanitisation, certified clinical crew protocols, and telemetry integration across Bangladesh.',
    url: '/safety',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/safety-mission-hero.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Clinical Safety Standards and Advisory Board',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Safety Standards & Medical Governance — PulseRoute',
    description:
      'Explore our hospital-grade sanitisation, certified clinical crew protocols, and telemetry integration across Bangladesh.',
    images: ['/images/safety-mission-hero.png'],
  },
};

export default function SafetyStandardsPage() {
  return (
    <div className="flex w-full flex-col">
      <SafetyHeroSection />
      <MissionVisionSection />
      <MedicalAdvisoryBoardSection />
      <HeldStandardsSection />
      <TimelineSection />
    </div>
  );
}
