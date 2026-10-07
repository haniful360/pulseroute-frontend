import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-200">
      {/* Top Navbar Skeleton */}
      <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-2xl bg-red-100" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-7 w-48 rounded-full" />
          </div>
          <Skeleton className="h-12 sm:h-14 w-full rounded-2xl" />
          <Skeleton className="h-5 w-4/5 mx-auto rounded-lg" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-40 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
        </div>

        {/* 3 Featured Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
            >
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
