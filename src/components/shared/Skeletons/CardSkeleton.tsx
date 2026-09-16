'use client';

export default function CardSkeleton() {
  return (
    <div className="flex w-full flex-col rounded-md border border-white/5 bg-[#0B1120] p-4">
      {/* Thumbnail Box Skeleton */}
      <div className="relative aspect-16/10 w-full animate-pulse rounded-lg bg-[#0F172A]">
        {/* Badge Skeleton */}
        <div className="absolute top-2.5 left-2.5 h-5 w-16 rounded bg-slate-700/40" />
      </div>

      {/* Content Context Section Skeleton */}
      <div className="flex flex-1 flex-col justify-between pt-5">
        <div>
          {/* Title Skeleton (2 lines) */}
          <div className="space-y-2">
            <div className="h-5 w-5/6 animate-pulse rounded bg-slate-800/90" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800/90" />
          </div>

          {/* Description Skeleton (2 lines) */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-800/60" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-800/60" />
          </div>
        </div>

        {/* Metadata Details Skeleton */}
        <div className="mt-5 flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            {/* Icon & text skeleton */}
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-slate-800/90" />
            <div className="h-3.5 w-12 animate-pulse rounded bg-slate-800/90" />
          </div>
          <span className="text-[#475569]">/</span>
          <div className="h-3.5 w-20 animate-pulse rounded bg-slate-800/90" />
        </div>

        {/* Action Button Skeleton */}
        <div className="mt-5 h-10 w-full animate-pulse rounded-sm bg-[#1E293B]" />
      </div>
    </div>
  );
}
