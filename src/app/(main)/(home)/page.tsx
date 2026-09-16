import React from 'react';
import { HeroSection } from './_components/HeroSection';
import { StatsBar } from './_components/StatsBar';
import { VehicleClassesSection } from './_components/VehicleClassesSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { SafetyStandardsSection } from './_components/SafetyStandardsSection';
import { TestimonialsSection } from './_components/TestimonialsSection';

export const metadata = {
  title: 'PulseRoute — Instant Emergency Ambulance Dispatch',
  description:
    'Verified ambulance dispatch network in Bangladesh. Book Basic, AC, ICU, CCU, Neonatal, and Freezer vans with transparent upfront pricing and live GPS telemetry.',
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
