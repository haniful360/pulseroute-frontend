import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminRadarSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2. Map & Realtime Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Large Simulated Map Area */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
          <Skeleton className="h-[520px] w-full rounded-2xl" />
        </div>

        {/* Live Radar Dispatch Feed */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRadarSkeleton;
