import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface StandardItem {
  title: string;
  description: string;
}

const STANDARDS_LIST: StandardItem[] = [
  {
    title: 'Certified paramedics on every critical trip',
    description:
      'NID-verified, BLS or ACLS certified, re-screened annually. Their name and photo appear before pickup.',
  },
  {
    title: 'Hospital-grade sanitised vehicles',
    description:
      'Disinfected after every patient, deep-cleaned each shift, and logged in the driver app for audit.',
  },
  {
    title: 'Real-time telemetry, shared with family',
    description:
      'Location, speed and streamed vitals visible to you and pre-notified to the receiving hospital.',
  },
  {
    title: '100% cashless, fare locked at booking',
    description:
      'A Stripe hold at dispatch, captured only after drop-off. The roadside negotiation is gone.',
  },
];

interface BadgeItem {
  code: string;
  detail: string;
}

const BADGES: BadgeItem[] = [
  { code: 'ISO 9001:2015', detail: 'Dispatch quality management' },
  { code: 'DGHS Registered', detail: 'Directorate General of Health Services' },
  { code: 'BRTA Fitness', detail: 'Every vehicle, re-certified annually' },
  { code: 'Stripe Verified', detail: 'PCI-DSS Level 1 payments' },
  { code: 'ACLS / BLS Crews', detail: 'Re-screened every 12 months' },
];

export const HeldStandardsSection: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Standards & Verification Badges */}
          <div className="space-y-8 lg:col-span-7">
            <div>
              <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Safety standards we can be held to
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Emergency transport in Bangladesh has run on trust and phone calls. We replaced both
                with records you can check.
              </p>
            </div>

            {/* Checklist of 4 Core Standards */}
            <div className="space-y-5">
              {STANDARDS_LIST.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 5 Accreditation & Compliance Badges */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {BADGES.map((badge) => (
                  <div
                    key={badge.code}
                    className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <span className="block text-xs font-bold text-slate-900 sm:text-sm">
                      {badge.code}
                    </span>
                    <span className="mt-1 block text-[11px] leading-tight text-slate-500">
                      {badge.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Shift-Audit Equipment Photo */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="relative aspect-[4/3] w-full bg-slate-100 sm:aspect-[16/11]">
                <Image
                  src="/images/equipment-audit-check.png"
                  alt="Equipment check before shift start logged in the driver app"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
              <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs leading-relaxed text-slate-500">
                  Equipment check before shift start — logged in the driver app, audited weekly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
