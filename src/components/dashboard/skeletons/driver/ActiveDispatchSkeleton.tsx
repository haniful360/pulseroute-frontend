import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveDispatchSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Navigation & Mission Status Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-3 w-56 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2. Real-Time Turn-by-Turn GPS Map */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
        <Skeleton className="h-[440px] w-full rounded-3xl sm:h-[520px]" />

        {/* Floating Driver Navigation HUD */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Patient Info & Action Buttons Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Patient & Route Information (6 cols) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Paramedic Mission Milestones & Status Progression (6 cols) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 lg:col-span-6">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="space-y-3 pt-1">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveDispatchSkeleton;
