'use client';

import { CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import React, { useState } from 'react';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  author: string;
  initials: string;
  location: string;
  badge: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Booked a freezer van for my uncle at midnight. It was handled quietly and respectfully, and the price shown at booking was the price we paid.',
    author: 'Mahmudul Hasan',
    initials: 'MH',
    location: 'Sylhet',
    badge: 'Verified Trip',
  },
  {
    quote:
      'The dispatcher called me within seconds of the request to confirm the floor number. That small thing saved minutes getting the stretcher up.',
    author: 'Nusrat Jahan',
    initials: 'NJ',
    location: 'Mirpur, Dhaka',
    badge: 'Verified Trip',
  },
  {
    quote:
      'We use PulseRoute for neonatal transfers out of our clinic. The incubator handover is clean and the crew logs vitals we can actually read on arrival.',
    author: 'Dr. Tariq Ahmed',
    initials: 'TA',
    location: 'Dhanmondi, Dhaka',
    badge: 'Verified Clinic Partner',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Nav Controls */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              What families said after the trip
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Every review below is attached to a completed, GPS-verified trip.
            </p>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <DynamicActionButton
              type="button"
              variant="outline"
              size="icon-sm"
              rounded="full"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </DynamicActionButton>
            <DynamicActionButton
              type="button"
              variant="outline"
              size="icon-sm"
              rounded="full"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </DynamicActionButton>
          </div>
        </div>

        {/* Testimonials Grid / Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all',
                activeIndex === idx
                  ? 'border-primary ring-primary/20 ring-1'
                  : 'border-slate-200 hover:shadow-md',
              )}
            >
              <div>
                {/* 5 Gold Stars */}
                <div className="mb-4 flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-sm leading-relaxed text-slate-700 italic sm:text-base">
                  “{item.quote}”
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm leading-tight font-bold text-slate-900">
                      {item.author}
                    </h4>
                    <span className="text-xs text-slate-500">{item.location}</span>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>{item.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-2 w-6 rounded-full bg-red-600" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
