import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MedicalProfileSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Medical SOS Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-red-200 bg-red-50/60 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl bg-red-200/80" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-red-200/80 rounded-lg" />
              <Skeleton className="h-4 w-72 bg-red-100 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-36 rounded-xl bg-red-200/80" />
          </div>
        </div>
      </div>

      {/* 2. Blood Group & Primary Vitals */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-3 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
            <Skeleton key={b} className="h-12 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* 3. Conditions, Allergies & Notes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 3, 4].map((t) => (
              <Skeleton key={t} className="h-8 w-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 3].map((t) => (
              <Skeleton key={t} className="h-8 w-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>

      {/* 4. Emergency Contacts Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-3 w-60 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          {[1, 2].map((c) => (
            <div key={c} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MedicalProfileSkeleton;
