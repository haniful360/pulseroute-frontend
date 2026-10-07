import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminAnnouncementsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* 2. Broadcast Cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-48 rounded-md" />
              </div>
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAnnouncementsSkeleton;
