import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverWalletSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2. Four Financial KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((kpi) => (
          <div key={kpi} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Ledger Table Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Table Rows */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-6 gap-4 border-b border-slate-100 pb-3">
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <Skeleton key={h} className="h-3.5 w-full rounded-md" />
            ))}
          </div>

          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-6 gap-4 items-center py-2.5">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DriverWalletSkeleton;
