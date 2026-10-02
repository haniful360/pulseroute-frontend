import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PatientOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <Skeleton className="h-6 w-52 rounded-full bg-slate-700/60" />
            <Skeleton className="h-9 w-72 rounded-xl bg-slate-700/80 sm:w-96" />
            <Skeleton className="h-4 w-full max-w-lg rounded-lg bg-slate-700/50" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-11 w-44 rounded-xl bg-slate-700/70" />
            <Skeleton className="h-11 w-44 rounded-xl bg-slate-700/40" />
          </div>
        </div>
      </div>

      {/* 2. Stat KPI Cards Skeleton (4 Grid) */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-8 w-20 rounded-lg" />
            <Skeleton className="mt-2 h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Main Content Split Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Recent Trips Table / Dispatches */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-3 w-48 rounded-md" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>

            {/* List Rows */}
            <div className="mt-4 divide-y divide-slate-100 space-y-3 pt-1">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-2xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-3 w-44 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Category Action Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((c) => (
              <div key={c} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Billing & Emergency Hotline */}
        <div className="space-y-6 lg:col-span-4">
          {/* Unpaid Invoices / Bill Pay Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Paramedic Hotline Card */}
          <div className="rounded-3xl border border-red-100 bg-red-50/40 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl bg-red-200/60" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 bg-red-200/60" />
                <Skeleton className="h-3 w-20 bg-red-100" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl bg-red-200/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientOverviewSkeleton;
