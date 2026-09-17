import Link from 'next/link';
import React from 'react';

interface PulseRouteLogoProps {
  className?: string;
  isDark?: boolean;
  subtitle?: string;
}

export const PulseRouteLogo: React.FC<PulseRouteLogoProps> = ({
  className = '',
  isDark = false,
  subtitle = 'Emergency Dispatch',
}) => {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* Red Heartbeat Pulse Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md shadow-red-500/20 transition-transform duration-200 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-baseline text-[21px] leading-none font-extrabold tracking-tight">
          <span className={isDark ? 'text-white' : 'text-slate-900'}>Pulse</span>
          <span className="ml-0.5 text-red-600">Route</span>
        </div>
        <span
          className={`mt-1 text-[9px] font-bold tracking-[0.18em] uppercase ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
};

export default PulseRouteLogo;
