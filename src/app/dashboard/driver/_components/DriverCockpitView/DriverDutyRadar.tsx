'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Compass, Crosshair, Layers, Navigation, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriverDutyRadar() {
  const [trafficActive, setTrafficActive] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    setTimeout(() => setIsLocating(false), 1200);
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
      {/* Map Canvas Container */}
      <div className="relative h-[480px] w-full overflow-hidden bg-slate-900 sm:h-[540px] lg:h-[620px]">
        {/* Background Map Image */}
        <Image
          src="/assets/dashboard/driver/dhaka_radar_map.png"
          alt="Dhaka Emergency Radar Map"
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            trafficActive ? 'opacity-90' : 'opacity-70',
          )}
          priority
        />

        {/* Dynamic Radar Pulse Sweeper Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Concentric Radar Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ring 3 */}
            <div className="h-96 w-96 animate-pulse rounded-full border border-red-500/20 bg-red-500/5" />
            {/* Middle Ring 2 */}
            <div className="absolute h-64 w-64 rounded-full border border-red-500/30" />
            {/* Inner Ring 1 */}
            <div className="absolute h-36 w-36 rounded-full border border-red-500/40 bg-red-500/10" />

            {/* Radar Sweeping Line */}
            <div className="absolute h-96 w-96 animate-spin rounded-full border-t-2 border-red-500/60" />

            {/* Central Paramedic Unit Beacon */}
            <div className="absolute flex h-12 w-12 items-center justify-center">
              <span className="absolute h-10 w-10 animate-ping rounded-full bg-[#E63946]/40" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E63946] text-white shadow-lg shadow-red-500/50">
                <Navigation className="h-4 w-4 rotate-45 fill-white" />
              </div>
            </div>

            {/* Target 1: Emergency SOS Call (Dhanmondi) */}
            <div className="absolute -top-24 -left-20 flex flex-col items-center">
              <div className="flex items-center gap-1.5 rounded-full border border-red-500 bg-[#0B132B]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-md backdrop-blur-md">
                <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                <span>ICU SOS • Dhanmondi 27</span>
              </div>
              <div className="h-3 w-0.5 bg-red-500" />
            </div>

            {/* Target 2: Nearby Unit (Mohakhali) */}
            <div className="absolute top-28 right-16 flex flex-col items-center">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500 bg-[#0B132B]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-md backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>DH-204 • Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Top Left Card: Demand Zones */}
        <div className="absolute top-4 left-4 z-20 w-60 rounded-2xl border border-white/40 bg-white/90 p-3.5 shadow-lg backdrop-blur-md sm:w-68">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 animate-pulse text-[#E63946]" />
              <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                DEMAND ZONES
              </span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              LIVE
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Dhanmondi Zone */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="font-semibold text-slate-800">Dhanmondi</span>
                <span className="text-xs font-bold text-[#E63946]">High</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[85%] rounded-full bg-[#E63946]" />
              </div>
            </div>

            {/* Mohakhali Zone */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="font-semibold text-slate-800">Mohakhali</span>
                <span className="text-xs font-bold text-amber-500">Medium</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[55%] rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Top Right: Orientation Compass */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={handleLocate}
            title="Recenter Cockpit Position"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-[#E63946]"
          >
            <Crosshair className={cn('h-5 w-5', isLocating && 'animate-spin text-[#E63946]')} />
          </button>
        </div>

        {/* Bottom Map Telemetry Control Bar */}
        <div className="absolute right-4 bottom-4 left-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/30 bg-[#0B132B]/85 p-3 text-white shadow-xl backdrop-blur-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setTrafficActive(!trafficActive)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                trafficActive
                  ? 'border border-[#E63946]/40 bg-[#E63946]/20 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20',
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Traffic Layer</span>
            </button>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>12 Nearby Units</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Compass className="h-3.5 w-3.5 text-[#E63946]" />
            <span className="font-semibold text-white">Your Pos:</span>
            <span className="font-mono text-[11px] text-slate-200">23.7561° N, 90.3872° E</span>
          </div>
        </div>
      </div>
    </div>
  );
}
