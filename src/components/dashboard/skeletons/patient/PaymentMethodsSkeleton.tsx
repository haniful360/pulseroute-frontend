import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PaymentMethodsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-3 w-72 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* 2. Main 2-Column Payment Split */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols): Payment Methods Selection */}
        <div className="space-y-6 lg:col-span-7">
          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-2.5 rounded-2xl border border-slate-200 bg-white p-2">
            {[1, 2, 3].map((t) => (
              <Skeleton key={t} className="h-11 w-full rounded-xl" />
            ))}
          </div>

          {/* Saved Cards List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="space-y-3 pt-1">
              {[1, 2].map((card) => (
                <div key={card} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="h-10 w-14 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Invoice Summary & Checkout */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-36 rounded-md" />

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-2xl bg-red-600/70" />
            <div className="flex items-center justify-center gap-2 pt-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodsSkeleton;
