import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function WardStatusSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Search Input */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-80 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-72 rounded-xl" />
      </div>

      {/* 2. Three Emergency Ward KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((k) => (
          <div key={k} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Hospital Emergency Triage Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((hosp) => (
          <div key={hosp} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Bed availability meters */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[1, 2, 3].map((b) => (
                <div key={b} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 space-y-1 text-center">
                  <Skeleton className="mx-auto h-3 w-16" />
                  <Skeleton className="mx-auto h-6 w-12 rounded-md" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WardStatusSkeleton;
