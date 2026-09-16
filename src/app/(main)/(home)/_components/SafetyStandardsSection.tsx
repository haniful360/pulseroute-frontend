import { Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import React from 'react';

interface ChecklistItem {
  title: string;
  description: string;
}

const CHECKLIST: ChecklistItem[] = [
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

interface Accreditation {
  code: string;
  detail: string;
}

const ACCREDITATIONS: Accreditation[] = [
  { code: 'ISO 9001:2015', detail: 'Dispatch quality management' },
  { code: 'DGHS Registered', detail: 'Directorate General of Health Services' },
  { code: 'BRTA Fitness', detail: 'Every vehicle, re-certified annually' },
  { code: 'Stripe Verified', detail: 'PCI-DSS Level 1 payments' },
  { code: 'ACLS / BLS Crews', detail: 'Re-screened every 12 months' },
];

export const SafetyStandardsSection: React.FC = () => {
  return (
    <section id="safety" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-[#F8FAFC] p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Standards & Badges */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  Safety standards we can be held to
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  Emergency transport in Bangladesh has run on trust and phone calls. We replaced
                  both with records you can check.
                </p>
              </div>

              {/* 4 Standards Checkpoints */}
              <div className="space-y-4">
                {CHECKLIST.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance & Accreditation Badges */}
              <div className="border-t border-slate-200/70 pt-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {ACCREDITATIONS.map((acc, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                    >
                      <span className="block text-xs font-bold text-slate-900">{acc.code}</span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">
                        {acc.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Driver Inspection Audit Mockup */}
            <div className="flex justify-center lg:col-span-5">
              <div className="w-full max-w-sm space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Shift Pre-Flight Check</div>
                      <div className="text-[10px] font-semibold text-emerald-600">
                        Passed & Verified
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    Shift #4821
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-600">Oxygen Pressure (O2)</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="h-3 w-3" /> 1800 PSI (Full)
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-600">Defibrillator Diagnostics</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="h-3 w-3" /> 100% Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-600">Sterilisation Cycle</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="h-3 w-3" /> Completed 06:30 AM
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-600">GPS Telemetry Stream</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="h-3 w-3" /> Active & Synced
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 text-center">
                  <p className="text-xs leading-relaxed text-slate-500 italic">
                    “Equipment check before shift start — logged in the driver app, audited weekly.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyStandardsSection;
