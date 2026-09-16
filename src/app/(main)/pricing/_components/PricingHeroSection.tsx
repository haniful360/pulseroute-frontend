import React from 'react';

export const PricingHeroSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-950 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Know the fare before the ambulance moves.
          </h1>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
            Drag the distance, pick a vehicle class, and see the exact breakdown we lock at dispatch
            — base fare, per-km rate and any active surge.
          </p>
        </div>
      </div>
    </section>
  );
};
