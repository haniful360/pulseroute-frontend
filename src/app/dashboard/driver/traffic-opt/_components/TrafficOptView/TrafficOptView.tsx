'use client';

import React from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  Camera,
  Compass,
  Navigation,
  RefreshCw,
  Route,
  Signal,
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TrafficOptView() {
  const corridorNodes = [
    {
      corridor: 'Mirpur 10 ➔ United Hospital (Gulshan)',
      distance: '9.2 km',
      clearedTime: '11 mins (4m faster)',
      signals: '6 Automated Green Corridors',
      status: 'Active Corridor',
      dmpCamera: 'Live Feed Synced',
    },
    {
      corridor: 'Dhanmondi 27 ➔ Square Hospital (Panthapath)',
      distance: '3.4 km',
      clearedTime: '4 mins (6m faster)',
      signals: '3 Automated Green Corridors',
      status: 'Active Corridor',
      dmpCamera: 'Live Feed Synced',
    },
    {
      corridor: 'Uttara Sector 3 ➔ Evercare Hospital (Bashundhara)',
      distance: '12.8 km',
      clearedTime: '16 mins (8m faster)',
      signals: '8 Automated Green Corridors',
      status: 'High Congestion Bypass',
      dmpCamera: 'Live Feed Synced',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="AI Traffic Optimization &amp; Green Corridors"
          description="Predictive emergency ambulance routing powered by real-time Dhaka traffic cameras and signal automation."
        />
        <DynamicActionButton
          variant="outline"
          icon={RefreshCw}
          iconPosition="left"
          onClick={() => toast.success('Telemetry and DMP camera feeds refreshed.')}
          label="Refresh Telemetry"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] to-[#1C2541] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E63946] text-white shadow-lg shadow-red-500/30">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold">AI Green Wave Corridors</h3>
                <DynamicBadge text="DMP Synced" color="#06d6a0" size="xs" />
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Direct integration with Dhaka Metropolitan Police traffic signal networks for active corridor clearance.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">AVG TIME SAVED</p>
            <p className="text-2xl font-black text-emerald-400">38% Faster</p>
          </div>
        </div>
      </div>

      {/* Corridor Cards Grid */}
      <div className="grid gap-5">
        {corridorNodes.map((node, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Route className="h-5 w-5 text-[#E63946]" />
                <h4 className="text-base font-bold text-slate-900">{node.corridor}</h4>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <span>Distance: <b className="text-slate-900">{node.distance}</b></span>
                <span>•</span>
                <span className="text-emerald-600">Cleared Transit: <b>{node.clearedTime}</b></span>
                <span>•</span>
                <span>{node.signals}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                <Camera className="h-3.5 w-3.5 text-blue-500" />
                {node.dmpCamera}
              </span>
              <DynamicBadge text={node.status} color="#10b981" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
