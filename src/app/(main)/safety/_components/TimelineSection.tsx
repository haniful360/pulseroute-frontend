import { Heart } from 'lucide-react';
import React from 'react';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '2021',
    title: 'Founded in Dhaka',
    description:
      'Three paramedics and one engineer started with 6 vehicles and a shared phone line in Dhanmondi.',
  },
  {
    year: '2022',
    title: 'Live telemetry launched',
    description:
      'Every vehicle fitted with GPS and vitals streaming, giving families a live view of the route for the first time.',
  },
  {
    year: '2023',
    title: 'Cashless dispatch',
    description:
      'Stripe-backed payment holds removed the roadside fare negotiation that delayed critical trips.',
  },
  {
    year: '2024',
    title: 'Expanded to 8 cities',
    description:
      'Chattogram, Sylhet, Khulna, Rajshahi and Barishal joined the dispatch network with local crew partners.',
  },
  {
    year: '2025',
    title: '25,000 lives assisted',
    description:
      'Crossed 25,000 completed emergency transports with a median response time under 7 minutes.',
  },
  {
    year: '2026',
    title: '12 cities, 500+ vehicles',
    description:
      'Neonatal and cardiac fleets added, with a 24/7 medical command centre supervising every dispatch.',
  },
];

export const TimelineSection: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            How we got here
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Six years, measured in response times rather than funding rounds.
          </p>
        </div>

        {/* Chronological Timeline */}
        <div className="relative max-w-3xl pl-4 sm:pl-6">
          {/* Continuous Left Vertical Guideline */}
          <div className="absolute top-3 bottom-6 left-[23px] w-0.5 bg-slate-200 sm:left-[31px]" />

          <div className="space-y-10 sm:space-y-12">
            {MILESTONES.map((item) => (
              <div key={item.year} className="relative flex items-start gap-4 sm:gap-6">
                {/* Milestone Node Icon */}
                <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 shadow-xs sm:h-9 sm:w-9">
                  <Heart className="h-4 w-4 fill-red-50 text-red-600" />
                </div>

                {/* Content Block */}
                <div className="min-w-0 pt-0.5">
                  <span className="text-xs font-bold tracking-wider text-red-600">{item.year}</span>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
