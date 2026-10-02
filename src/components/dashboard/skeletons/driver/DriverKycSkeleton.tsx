import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverKycSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-60 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* 2. Verification Overview Status Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl bg-emerald-200" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-52 bg-emerald-200 rounded-lg" />
              <Skeleton className="h-4 w-72 bg-emerald-100 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-full bg-emerald-200" />
        </div>
      </div>

      {/* 3. Verified Documents Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((doc) => (
          <div key={doc} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverKycSkeleton;
