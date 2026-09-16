import { Ambulance, Clock, HeartPulse, MapPin } from 'lucide-react';
import React from 'react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    icon: <Clock className="h-5 w-5 text-red-500" />,
    value: '< 8 mins',
    label: 'Avg. response time',
  },
  {
    icon: <Ambulance className="h-5 w-5 text-red-500" />,
    value: '450+',
    label: 'Verified ambulances',
  },
  {
    icon: <MapPin className="h-5 w-5 text-red-500" />,
    value: '12',
    label: 'Cities covered',
  },
  {
    icon: <HeartPulse className="h-5 w-5 text-red-500" />,
    value: '18,500+',
    label: 'Lives assisted',
  },
];

export const StatsBar: React.FC = () => {
  return (
    <div className="border-y border-slate-800/80 bg-[#070A10] py-8 text-white lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-xl p-3 text-center transition-colors hover:bg-slate-900/40"
            >
              <div className="mb-2 rounded-full border border-slate-800 bg-slate-900 p-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
