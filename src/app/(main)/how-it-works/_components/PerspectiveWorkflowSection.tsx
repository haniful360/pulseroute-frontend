'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

type PerspectiveType = 'patients' | 'drivers' | 'admins';

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

const PERSPECTIVES_DATA: Record<
  PerspectiveType,
  {
    label: string;
    steps: WorkflowStep[];
  }
> = {
  patients: {
    label: 'For Patients',
    steps: [
      {
        step: '01',
        title: 'Open the booking widget',
        description:
          'Your pickup is pre-filled from device location. Correct the road or flat number if the pin landed on the wrong side of the block.',
      },
      {
        step: '02',
        title: 'Pick a vehicle class and severity',
        description:
          'Severity drives which crews are offered the trip. Critical restricts the offer to ICU and CCU vehicles with ACLS-certified paramedics.',
      },
      {
        step: '03',
        title: 'Confirm the fare range',
        description:
          'The estimate covers base fare, per-km rate and any active surge. It is locked at dispatch — the final charge cannot exceed the top of the range unless you change destination.',
      },
      {
        step: '04',
        title: 'Track and hand over',
        description:
          'Follow the vehicle live, share the trip link with family, and show the crew your patient notes at pickup. Payment settles automatically after drop-off.',
      },
    ],
  },
  drivers: {
    label: 'For Drivers',
    steps: [
      {
        step: '01',
        title: 'Go online and radar scan',
        description:
          'Set your availability and receive direct dispatch requests within your operating radius with clear patient notes and urgency level.',
      },
      {
        step: '02',
        title: '20-second priority offer',
        description:
          'Review distance, destination hospital, and guaranteed locked payout with one tap to accept before it cascades to other crews.',
      },
      {
        step: '03',
        title: 'Emergency turn-by-turn navigation',
        description:
          'Follow optimized siren-lane routing directly to the pickup point with continuous telemetry streaming back to dispatch.',
      },
      {
        step: '04',
        title: 'Instant cashless payout',
        description:
          'Complete patient handover at the hospital and receive your 88% fare share transferred directly to your Stripe wallet immediately.',
      },
    ],
  },
  admins: {
    label: 'For Admins',
    steps: [
      {
        step: '01',
        title: 'Watch the live dispatch board',
        description:
          'Every open request, vehicle position and crew status on one map, with unassigned critical requests escalated to the top of the queue.',
      },
      {
        step: '02',
        title: 'Override and reassign',
        description:
          'Manually assign, upgrade a vehicle class, or widen the search radius when a request cannot find a crew inside 15km.',
      },
      {
        step: '03',
        title: 'Verify partners',
        description:
          'Review driver documents, vehicle fitness certificates and crew certifications from a single approval queue with expiry reminders.',
      },
      {
        step: '04',
        title: 'Audit response times',
        description:
          'City-level dashboards for dispatch latency, on-scene time and sanitisation compliance, exportable for regulator reporting.',
      },
    ],
  },
};

export const PerspectiveWorkflowSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PerspectiveType>('admins');

  const activeData = PERSPECTIVES_DATA[activeTab];

  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Perspective Toggle Buttons (Pills) */}
        <div className="mb-10 flex flex-wrap items-center gap-3 sm:mb-12">
          {(Object.keys(PERSPECTIVES_DATA) as PerspectiveType[]).map((tabKey) => {
            const isCurrent = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={cn(
                  'cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200',
                  isCurrent
                    ? 'border border-[#0B0F17] bg-[#0B0F17] text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                {PERSPECTIVES_DATA[tabKey].label}
              </button>
            );
          })}
        </div>

        {/* 2x2 Grid of Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {activeData.steps.map((item) => (
            <Card
              key={item.step}
              className="flex flex-col justify-start rounded-2xl border-slate-200/90 p-6 shadow-xs transition-all hover:shadow-md sm:p-8"
            >
              {/* Step number in bold red */}
              <span className="mb-3 font-mono text-lg font-extrabold tracking-tight text-red-600 sm:text-xl">
                {item.step}
              </span>

              {/* Step title */}
              <h3 className="mb-2.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {item.title}
              </h3>

              {/* Step description */}
              <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerspectiveWorkflowSection;
