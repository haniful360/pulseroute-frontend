import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BookAmbulanceSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Emergency Notice */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="mt-1.5 h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-8 w-44 rounded-full" />
      </div>

      {/* 2. Main 2-Column Dispatch Form & Map */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols): Booking Form */}
        <div className="space-y-6 lg:col-span-7">
          {/* Pickup & Destination Inputs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="space-y-3 pt-1">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Ambulance Types Selection Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 text-center">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-3 w-14 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Medical Requirements Chips */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="flex flex-wrap gap-2 pt-1">
              {[1, 2, 3, 4].map((c) => (
                <Skeleton key={c} className="h-9 w-32 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Fare Estimation & Dispatch Button */}
          <div className="rounded-3xl border border-red-100 bg-red-50/40 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-red-100" />
              <Skeleton className="h-8 w-24 bg-red-200/80 rounded-lg" />
            </div>
            <Skeleton className="h-13 w-full rounded-2xl bg-red-200/80" />
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Route Map */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
            <Skeleton className="h-[460px] w-full rounded-2xl sm:h-[540px]" />
          </div>

          {/* Emergency Advisory Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-5 w-48 rounded-md" />
            </div>
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAmbulanceSkeleton;
