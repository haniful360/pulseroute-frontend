import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const JoinDriverHero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B132B] text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & Stats */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Drive with purpose,
              <br />
              earn with pride.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Partner your ambulance with the dispatch network that fills your idle hours and pays
              out the same day.
            </p>

            {/* Metrics Row */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-800/80 py-6 sm:gap-8">
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Commission
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">12%</p>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Payout time
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Instant
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Avg. monthly
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  ৳48–72k
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/register/driver"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/30 active:scale-[0.98]"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-700/60 shadow-2xl sm:aspect-[16/11] lg:rounded-3xl">
                <Image
                  src="/images/join-driver-hero.png"
                  alt="PulseRoute ambulance driver partner standing in front of hospital"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
