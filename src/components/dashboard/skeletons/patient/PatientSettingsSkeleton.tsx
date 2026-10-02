import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PatientSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* 2. Personal Information Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* 3. Emergency Broadcasting & Notifications Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-52 rounded-md" />
            <Skeleton className="h-3 w-72 rounded-md" />
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {[1, 2, 3].map((t) => (
            <div key={t} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-3 w-64 rounded-md" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Save Button */}
      <div className="flex justify-end pt-2">
        <Skeleton className="h-12 w-44 rounded-xl" />
      </div>
    </div>
  );
}

export default PatientSettingsSkeleton;
