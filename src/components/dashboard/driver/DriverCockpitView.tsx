'use client';

import DriverDutyRadar from './DriverDutyRadar';
import DriverSummaryPanel from './DriverSummaryPanel';

export default function DriverCockpitView() {
  return (
    <div className="space-y-6">
      {/* Top Cockpit Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            DUTY COCKPIT
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Real-time emergency radar and high-demand zones in Dhaka Central.
          </p>
        </div>

        {/* System Status Pill */}
        <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs sm:self-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase">System Status:</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            All Nodes Optimal
          </span>
        </div>
      </div>

      {/* Main Grid: Radar View & Shift Summary */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Live Radar Map (8 Cols) */}
        <div className="lg:col-span-8">
          <DriverDutyRadar />
        </div>

        {/* Right Column: Today's Summary & Active Shift (4 Cols) */}
        <div className="lg:col-span-4">
          <DriverSummaryPanel />
        </div>
      </div>
    </div>
  );
}
