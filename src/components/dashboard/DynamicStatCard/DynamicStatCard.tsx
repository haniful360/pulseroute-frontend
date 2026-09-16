/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { IStatCard } from '@/types/stat-card.types';
// import { TrendingDown, TrendingUp } from 'lucide-react';
import GradientWrapper from '../GradientWrapper/GradientWrapper';

// interface DynamicStatCardProps extends IStatCard {
//   index: number;
// }

const DynamicStatCard = ({
  title,
  value,
  // trend,
  // isUp,
  icon: Icon,
  iconBg,
  index,
}: any) => {
  // Auto Color
  const colors: ('blue' | 'green' | 'purple' | 'yellow')[] = ['blue', 'green', 'purple', 'yellow'];
  const autoColor = colors[index % colors.length];

  return (
    <GradientWrapper color={autoColor} innerClassName="px-6 py-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-2 flex items-end gap-4">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {/* <div
          className={`mb-1.5 flex items-center gap-1 text-sm font-semibold ${
            isUp ? 'text-success' : 'text-error'
          }`}
        >
          {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
          {trend}
          <span className="ml-1 font-medium text-gray-400">Last month</span>
        </div> */}
      </div>
    </GradientWrapper>
  );
};

export default DynamicStatCard;
