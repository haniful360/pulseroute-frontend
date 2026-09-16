import React from 'react';
import { PricingHeroSection } from './_components/PricingHeroSection';
import { InteractiveFareCalculator } from './_components/InteractiveFareCalculator';
import { VehicleClassesManifestSection } from './_components/VehicleClassesManifestSection';

export const metadata = {
  title: 'Fleet Pricing & Fare Breakdown — PulseRoute Emergency Dispatch',
  description:
    'Transparent upfront ambulance pricing. Calculate base fares, per-km rates, and locked dispatch quotes for BLS, AC, ICU, CCU, Neonatal, and Freezer vans in Bangladesh.',
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
