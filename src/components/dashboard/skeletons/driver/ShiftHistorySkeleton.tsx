import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ShiftHistorySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Export Logs Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* 2. Metrics Row (4 Grid) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((m) => (
          <div key={m} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Shifts Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3 pt-1">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 border-b border-slate-100 pb-3">
            {[1, 2, 3, 4, 5, 6, 7].map((h) => (
              <Skeleton key={h} className="h-3.5 w-full rounded-md" />
            ))}
          </div>

          {/* 5 Rows */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-7 gap-4 items-center py-2.5">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShiftHistorySkeleton;
