import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AmbulanceProfileSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* 2. Vehicle Main Spec Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-60 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1.5">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Onboard Medical Equipment Checklist */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
          {[1, 2, 3, 4].map((eq) => (
            <div key={eq} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AmbulanceProfileSkeleton;
