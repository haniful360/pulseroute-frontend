'use client';

import GradientWrapper from '@/components/dashboard/GradientWrapper/GradientWrapper';

interface StatCardSkeletonProps {
  index: number;
}

const StatCardSkeleton = ({ index }: StatCardSkeletonProps) => {
  const colors: ('blue' | 'green' | 'purple' | 'yellow')[] = ['blue', 'green', 'purple', 'yellow'];
  const autoColor = colors[index % colors.length];

  return (
    <GradientWrapper color={autoColor} innerClassName="px-6 py-5">
      <div className="animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-10 w-10 rounded-full bg-white/10" />
        </div>
        <div className="mt-2 flex items-end gap-4">
          <div className="h-9 w-10 rounded bg-white/10" />
          <div className="mb-1.5 h-4 w-32 rounded bg-white/10" />
        </div>
      </div>
    </GradientWrapper>
  );
};

export default StatCardSkeleton;
