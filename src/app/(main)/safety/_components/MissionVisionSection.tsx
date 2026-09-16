import { Compass, Target } from 'lucide-react';
import React from 'react';

export const MissionVisionSection: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Mission Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs transition-shadow hover:shadow-sm sm:p-10">
            <div>
              {/* Mission Icon Badge */}
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-red-50/70 text-red-600">
                <Target className="h-5 w-5" />
              </div>

              {/* Title */}
              <h2 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">Mission</h2>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Make emergency medical transport as instant, transparent and accountable as calling
                a ride — with the clinical standards of a hospital ward, priced the same for
                everyone regardless of who is asking.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs transition-shadow hover:shadow-sm sm:p-10">
            <div>
              {/* Vision Icon Badge */}
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/70 text-emerald-600">
                <Compass className="h-5 w-5" />
              </div>

              {/* Title */}
              <h2 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">Vision</h2>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                A national dispatch layer where every ambulance, public or private, is visible on
                one map — so the nearest qualifying crew always wins, and no vehicle sits idle while
                a patient waits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
