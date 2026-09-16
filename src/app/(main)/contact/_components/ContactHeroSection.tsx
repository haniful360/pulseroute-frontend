import { PhoneCall } from 'lucide-react';
import React from 'react';

export const ContactHeroSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-950 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left Column: Headline & Subtitle */}
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Emergency now? Call. <br />
              Everything else, write to us.
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              The hotline is staffed by dispatchers, not a phone tree. Non-urgent enquiries get an
              answer within one working day.
            </p>
          </div>

          {/* Right Column: 24/7 Emergency Hotline Card */}
          <div className="flex-shrink-0">
            <a
              href="tel:999"
              className="group flex items-center gap-5 rounded-2xl bg-red-600 px-6 py-5 text-white shadow-xl shadow-red-950/40 transition-all duration-200 hover:bg-red-700 hover:shadow-2xl sm:px-8 sm:py-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white transition-transform group-hover:scale-105">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold tracking-wider text-red-100 uppercase">
                  24/7 Emergency Hotline
                </span>
                <span className="block text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  999
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
