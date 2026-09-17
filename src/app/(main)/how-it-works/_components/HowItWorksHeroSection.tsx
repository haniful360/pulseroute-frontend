import React from 'react';

export const HowItWorksHeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-[#090D16] py-16 text-white sm:py-20 lg:py-24">
      {/* Subtle radial glow background effect */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          {/* Main Title matching Figma exactly */}
          <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[54px]">
            How PulseRoute works, <br className="hidden sm:inline" />
            <span>depending on which side you are on.</span>
          </h1>

          {/* Subtitle matching Figma exactly */}
          <p className="max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            The same dispatch runs three views: the family requesting, the crew responding, and the
            command centre supervising.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHeroSection;
