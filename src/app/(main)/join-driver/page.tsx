import React from 'react';
import { JoinDriverHero } from './_components/JoinDriverHero';
import { JoinDriverBenefits } from './_components/JoinDriverBenefits';
import { JoinDriverSteps } from './_components/JoinDriverSteps';

export const metadata = {
  title: 'Join as a Driver Partner — PulseRoute Emergency Dispatch',
  description:
    'Drive with purpose, earn with pride. Partner your ambulance with the dispatch network that fills your idle hours and pays out the same day with 12% commission and instant Stripe payouts.',
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
