import type { Metadata } from 'next';
import { FaqSection } from './_components/FaqSection';
import { HowItWorksHeroSection } from './_components/HowItWorksHeroSection';
import { PerspectiveWorkflowSection } from './_components/PerspectiveWorkflowSection';

export const metadata: Metadata = {
  title: 'How It Works — PulseRoute Emergency Ambulance Dispatch',
  description:
    'Discover how PulseRoute operates seamlessly across three views: for families requesting emergency transport, crews responding on siren-routes, and the command centre supervising.',
};

export default function HowItWorksPage() {
  return (
    <div className="flex w-full flex-col">
      <HowItWorksHeroSection />
      <PerspectiveWorkflowSection />
      <FaqSection />
    </div>
  );
}
