import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverCockpitSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Cockpit Header with Duty Status Pill */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-9 w-44 rounded-full" />
      </div>

      {/* 2. Main Grid: Radar View & Shift Summary */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Live Radar Map */}
        <div className="space-y-6 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <Skeleton className="h-5 w-48 bg-slate-800 rounded-md" />
              </div>
              <Skeleton className="h-7 w-28 bg-slate-800 rounded-full" />
            </div>

            {/* Radar Circular Visual Placeholder */}
            <div className="relative my-8 flex min-h-[340px] items-center justify-center">
              <Skeleton className="h-64 w-64 rounded-full bg-slate-800/60" />
              <div className="absolute flex flex-col items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-2xl bg-red-600/40" />
                <Skeleton className="h-4 w-32 bg-slate-700 rounded-md" />
              </div>
            </div>

            {/* Radar Quick Stats */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-4">
              {[1, 2, 3].map((r) => (
                <div key={r} className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-3 w-16 bg-slate-800" />
                  <Skeleton className="mx-auto h-6 w-20 bg-slate-700 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Shift Summary Panel */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>

            {/* Today's Metrics */}
            <div className="space-y-3">
              {[1, 2, 3].map((m) => (
                <div key={m} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
              ))}
            </div>

            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* 3. Bottom Dispatch Connection Banner */}
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-red-200" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-52 bg-red-200" />
              <Skeleton className="h-3 w-72 bg-red-100" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-lg bg-red-200" />
        </div>
      </div>
    </div>
  );
}

export default DriverCockpitSkeleton;
