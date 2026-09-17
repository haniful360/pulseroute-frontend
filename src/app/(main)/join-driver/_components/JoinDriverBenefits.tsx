import React from 'react';
import { CreditCard, ShieldCheck, Navigation, CalendarClock, ShieldAlert } from 'lucide-react';

interface BenefitItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  {
    icon: CreditCard,
    title: 'Fair 12% commission',
    description:
      'One flat rate. No peak-hour deductions, no cancellation penalties on medical escalations.',
  },
  {
    icon: ShieldCheck,
    title: 'Instant Stripe payouts',
    description:
      'Your 88% share transfers minutes after you close the trip, not at the end of the week.',
  },
  {
    icon: Navigation,
    title: 'Emergency navigation app',
    description:
      'Turn-by-turn routing with siren-lane hints and a direct line to the medical command centre.',
  },
  {
    icon: CalendarClock,
    title: 'Flexible shifts',
    description:
      'Go online when you want. Night shifts carry a surge multiplier that goes to you, not us.',
  },
  {
    icon: ShieldAlert,
    title: 'Insurance coverage',
    description: 'On-trip accident and liability cover for you and your crew, included at no cost.',
  },
];

export const JoinDriverBenefits: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What partnering gets you
          </h2>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Built with driver-partners who were tired of chasing payments.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-white hover:shadow-md hover:shadow-slate-100"
              >
                <div>
                  <div className="mb-4 inline-flex items-center justify-center text-red-600">
                    <Icon className="h-6 w-6 stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
