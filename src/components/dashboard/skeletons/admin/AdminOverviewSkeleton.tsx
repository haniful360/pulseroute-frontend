import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
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

      {/* 2. Top Stats Grid (4 Cards) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Operational Analytics & Live Feeds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-3 w-64 rounded-md" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl p-2.5">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Active Dispatches Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="grid grid-cols-5 gap-4 items-center py-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-xl justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewSkeleton;
