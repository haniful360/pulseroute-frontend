import Image from 'next/image';
import React from 'react';

export const SafetyHeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-20 sm:py-28 lg:py-32">
      {/* Background Image with Dark Vignette / Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/safety-mission-hero.png"
          alt="PulseRoute Emergency Ambulance Dispatch in City"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/65" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          {/* Eyebrow Label */}
          <span className="inline-block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Our Mission
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            No family should negotiate a fare while a life is on the line.
          </h1>

          {/* Subtext Paragraph */}
          <p className="pt-2 text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
            PulseRoute started in 2021 with six vehicles and one shared phone line. Today a verified
            crew reaches a patient in under seven minutes across twelve cities.
          </p>
        </div>
      </div>
    </section>
  );
};
