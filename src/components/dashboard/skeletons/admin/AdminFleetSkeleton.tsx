import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminFleetSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* 2. Status Chips / Counts */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 3. Grid of Fleet Vehicle Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Skeleton className="h-8 rounded-xl" />
              <Skeleton className="h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFleetSkeleton;
