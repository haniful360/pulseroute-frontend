import type { Metadata } from 'next';
import { FaqSection } from './_components/FaqSection';
import { HowItWorksHeroSection } from './_components/HowItWorksHeroSection';
import { PerspectiveWorkflowSection } from './_components/PerspectiveWorkflowSection';

export const metadata: Metadata = {
  title: 'How It Works — Emergency Dispatch, Siren Corridors & Command Hub',
  description:
    'Discover how PulseRoute operates seamlessly: one-tap emergency requests for families, siren-corridor GPS navigation for crews, and 24/7 command centre telemetry supervision.',
  keywords: [
    'How ambulance dispatch works',
    'Ambulance booking process',
    'Siren corridor routing',
    'Emergency telemetry',
    'Patient hospital handoff',
  ],
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How PulseRoute Works — Unified Emergency Dispatch Triad',
    description:
      'Explore the real-time interaction between patient dispatch, paramedic live navigation, and hospital ER telemetry handoffs.',
    url: '/how-it-works',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'How PulseRoute Ambulance Dispatch System Operates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works — Emergency Dispatch, Siren Corridors & Command Hub',
    description:
      'Explore the real-time interaction between patient dispatch, paramedic live navigation, and hospital ER telemetry handoffs.',
    images: ['/images/hero-map.png'],
  },
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
