import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-60 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2. Stat / Filter Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Search and Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
        <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* 4. Table Body */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Table Rows */}
        <div className="space-y-3 pt-1">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 border-b border-slate-100 pb-3">
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <Skeleton key={h} className="h-4 w-full rounded-md" />
            ))}
          </div>

          {/* 6 Data Rows */}
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="grid grid-cols-6 gap-4 items-center py-3">
              <Skeleton className="h-4 w-20 rounded-md" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-xl justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminTableSkeleton;
