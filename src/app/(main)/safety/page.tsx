import React from 'react';
import { HeldStandardsSection } from './_components/HeldStandardsSection';
import { MedicalAdvisoryBoardSection } from './_components/MedicalAdvisoryBoardSection';
import { MissionVisionSection } from './_components/MissionVisionSection';
import { SafetyHeroSection } from './_components/SafetyHeroSection';
import { TimelineSection } from './_components/TimelineSection';

export const metadata = {
  title: 'Safety Standards & Mission — PulseRoute Emergency Dispatch',
  description:
    'Clinician-audited protocols, verifiable safety standards, hospital-grade sanitisation, and real-time telemetry across twelve cities in Bangladesh.',
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
