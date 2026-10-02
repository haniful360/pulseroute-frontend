import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* 2. Settings Grid (8 cols / 4 cols) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols): Preferences & Toggles */}
        <div className="space-y-6 lg:col-span-8">
          {/* Dispatch Preferences Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-52 rounded-md" />
                <Skeleton className="h-3 w-72 rounded-md" />
              </div>
            </div>

            <div className="space-y-5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-64 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Profile & Save Actions */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-36 rounded-md" />
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverSettingsSkeleton;
