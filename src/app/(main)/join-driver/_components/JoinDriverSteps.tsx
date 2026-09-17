import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

interface StepItem {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
}

const steps: StepItem[] = [
  {
    icon: FileText,
    step: 'Step 1 of 3',
    title: 'Upload driving licence',
    description: 'Valid professional licence, verified against BRTA records in under a day.',
  },
  {
    icon: ShieldCheck,
    step: 'Step 2 of 3',
    title: 'Upload NID',
    description:
      'Identity check against national records — the same screening our paramedics pass.',
  },
  {
    icon: Wrench,
    step: 'Step 3 of 3',
    title: 'Vehicle fitness certificate',
    description:
      'Current fitness paper plus an in-person equipment inspection at your nearest hub.',
  },
];

export const JoinDriverSteps: React.FC = () => {
  return (
    <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Three documents, then you are online
          </h2>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Most partners are approved and taking trips within 48 hours.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition-colors group-hover:bg-red-100/70">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <p className="text-xs font-bold tracking-wider text-red-600 uppercase">
                    {item.step}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card Banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-[#0B132B] p-8 shadow-xl sm:p-10 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to take your first dispatch?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Start the application now — you can upload documents from your phone.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/register/driver"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/30 active:scale-[0.98] sm:w-auto"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
