import { Skeleton } from '@/components/ui/skeleton';

export default function PayoutsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-slate-200" />
          <Skeleton className="h-8 w-64 bg-slate-200" />
          <Skeleton className="h-4 w-96 bg-slate-200" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
            <Skeleton className="h-6 w-28 bg-slate-200" />
            <Skeleton className="h-4 w-20 bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64 rounded-xl bg-slate-200" />
          <Skeleton className="h-10 w-48 rounded-xl bg-slate-200" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
