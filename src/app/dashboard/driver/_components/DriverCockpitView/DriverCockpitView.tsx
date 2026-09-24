'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Ambulance, BellRing, Check, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import DriverDutyRadar from './DriverDutyRadar';
import DriverSummaryPanel from './DriverSummaryPanel';

export default function DriverCockpitView() {
  const [dispatchOpen, setDispatchOpen] = useState(false);

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
      <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white p-2 text-[#e63946] shadow-sm">
            <BellRing className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-[#0b132b]">Incoming dispatch simulation</p>
            <p className="text-[10px] text-[#64748b]">
              Open the Figma-aligned mission request modal.
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDispatchOpen(true)}>
          View dispatch
        </Button>
      </div>
      <Dialog open={dispatchOpen} onOpenChange={setDispatchOpen}>
        <DialogContent className="max-w-[430px] overflow-hidden rounded-3xl border-0 p-0">
          <div className="bg-[#0b132b] px-6 py-5 text-white">
            <DialogHeader>
              <DialogTitle className="text-left text-lg">Incoming dispatch</DialogTitle>
            </DialogHeader>
            <p className="mt-1 text-xs text-slate-300">
              Critical ICU transport request near Dhanmondi 27.
            </p>
          </div>
          <div className="p-6">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-[#e63946] text-center">
              <div>
                <p className="text-4xl font-black text-[#0b132b]">142</p>
                <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                  Seconds left
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3 rounded-2xl bg-[#f8fafc] p-4 text-xs">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#e63946]" />
                <div>
                  <p className="font-bold">Pickup: Road 27, Dhanmondi</p>
                  <p className="text-[#64748b]">1.8 km away &middot; 4 min ETA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Ambulance className="h-4 w-4 text-[#64748b]" />
                <div>
                  <p className="font-bold">ICU ambulance required</p>
                  <p className="text-[#64748b]">United Hospital, Gulshan</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setDispatchOpen(false)}>
                <X /> Decline
              </Button>
              <Button variant="danger" onClick={() => setDispatchOpen(false)}>
                <Check /> Accept dispatch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
