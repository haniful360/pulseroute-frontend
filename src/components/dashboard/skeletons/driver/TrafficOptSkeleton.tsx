import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TrafficOptSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Refresh Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-80 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* 2. Three Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((m) => (
          <div key={m} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. AI Predictive Corridor Nodes List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="space-y-4 pt-1">
          {[1, 2, 3].map((node) => (
            <div key={node} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-5 w-64 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
                {[1, 2, 3, 4].map((sub) => (
                  <div key={sub} className="space-y-1">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrafficOptSkeleton;
