import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-8 w-60 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      {/* 2. Settings Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Navigation / Tabs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((f) => (
              <div key={f} className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsSkeleton;
