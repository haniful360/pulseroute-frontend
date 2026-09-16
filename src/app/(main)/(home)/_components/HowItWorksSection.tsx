import React from 'react';

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    step: 'Step 1',
    title: '1-Tap Request',
    description:
      'Geolocation fills your pickup, you pick the vehicle class, and the request hits the dispatch queue on one tap.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-red-600"
      >
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
  },
  {
    step: 'Step 2',
    title: 'Smart Paramedic Matching',
    description:
      'We rank nearby crews by live travel time, certification and shift load, then offer the trip for 20 seconds before cascading.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-red-600"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    step: 'Step 3',
    title: 'Live Telemetry & Cashless Payment',
    description:
      'Follow the ambulance on the map, watch vitals stream in, and settle automatically after drop-off. No cash, no haggling.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-red-600"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="border-y border-slate-200/60 bg-[#FAFAFA] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl sm:mb-16">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            How a PulseRoute dispatch runs
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Three moments, none of which need a phone call.
          </p>
        </div>

        {/* 3 Step Cards with connecting line */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {/* Subtle line across steps for desktop */}
          <div className="absolute top-7 right-14 left-14 -z-0 hidden h-0.5 bg-slate-200 md:block" />

          {STEPS.map((item, idx) => (
            <div key={idx} className="group relative z-10 flex flex-col items-start">
              {/* Icon Circle */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-red-100 bg-white shadow-md shadow-red-500/10 transition-all duration-300 group-hover:scale-110 group-hover:border-red-400">
                {item.icon}
              </div>

              {/* Step indicator */}
              <span className="mb-1.5 text-xs font-bold tracking-wider text-red-600 uppercase">
                {item.step}
              </span>

              {/* Title */}
              <h3 className="mb-2.5 text-lg font-bold text-slate-900 sm:text-xl">{item.title}</h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
