'use client';

import { useState, useMemo } from 'react';
import { Ambulance, Radio, Navigation, WifiOff, Settings2, Search, MapPin, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const onlineVehicles = [
  { id: 'DH-102', name: 'Pulse ICU 102', operator: 'PulseRoute', type: 'ICU', status: 'Online', area: 'Dhanmondi' },
  { id: 'DH-204', name: 'Care AC 204', operator: 'Care Ambulance', type: 'AC', status: 'On Dispatch', area: 'Gulshan' },
  { id: 'DH-418', name: 'Pulse CCU 418', operator: 'PulseRoute', type: 'CCU', status: 'Online', area: 'Uttara' },
  { id: 'DH-105', name: 'Pulse ICU 105', operator: 'PulseRoute', type: 'ICU', status: 'On Dispatch', area: 'Banani' },
  { id: 'DH-209', name: 'Care AC 209', operator: 'Care Ambulance', type: 'AC', status: 'Online', area: 'Mirpur' },
  { id: 'DH-422', name: 'Pulse ICU 422', operator: 'PulseRoute', type: 'ICU', status: 'Online', area: 'Tejgaon' },
  { id: 'DH-515', name: 'United AC 515', operator: 'United Healthcare', type: 'AC', status: 'Online', area: 'Mohammadpur' },
  { id: 'DH-601', name: 'Metro BLS 601', operator: 'Metro Health', type: 'Basic', status: 'On Dispatch', area: 'Bashundhara' },
];

export default function RadarView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return onlineVehicles;
    return onlineVehicles.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'ICU': return 'bg-red-50 text-[#E63946] border-red-100';
      case 'CCU': return 'bg-red-50 text-[#E63946] border-red-100';
      case 'AC': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Basic': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
          OPERATIONS CONTROL CENTER
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Live Fleet Radar
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Dhaka-wide real-time GPS telemetry and active emergency response tracking.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Ambulance className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Registered fleet</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">84</div>
                <div className="text-xs font-medium text-emerald-600 mb-1">4 added this week</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Online now</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">62</div>
                <div className="text-xs font-medium text-slate-500 mb-1">74% availability</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">On dispatch</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">12</div>
                <div className="text-xs font-medium text-amber-600 mb-1">3 critical trips</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <WifiOff className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Offline</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">10</div>
                <div className="text-xs font-medium text-[#E63946] mb-1">2 maintenance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Map Area */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden p-4">
          <div className="relative min-h-[500px] overflow-hidden rounded-2xl bg-[#d6d8dc]">
            <div className="absolute inset-0 bg-[url('/assets/dashboard/driver/dhaka_radar_map.png')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-slate-900/10" />

            {/* Info Card Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <div className="rounded-xl bg-white p-4 shadow-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="h-4 w-4 animate-pulse text-[#E63946]" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fleet coverage live</span>
                </div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">84 <span className="text-base font-medium text-slate-500">active units</span></div>
                <div className="text-xs font-medium text-[#E63946]">12 currently responding</div>
              </div>
            </div>

            {/* Ambulance Markers */}
            <div className="absolute left-[38%] top-[42%] flex flex-col items-center">
              <div className="rounded-full border-2 border-white bg-[#e63946] p-2 text-white shadow-lg relative">
                <div className="absolute -inset-1 rounded-full bg-[#e63946]/30 animate-ping" />
                <Ambulance className="h-4 w-4 relative z-10" />
              </div>
              <div className="mt-1 rounded bg-[#0b132b] px-2 py-1 text-[9px] font-bold text-white shadow-md">
                DH-102
              </div>
            </div>

            <div className="absolute right-[24%] top-[27%] flex flex-col items-center">
              <div className="rounded-full border-2 border-white bg-[#e63946] p-2 text-white shadow-lg relative">
                <div className="absolute -inset-1 rounded-full bg-[#e63946]/30 animate-ping" />
                <Ambulance className="h-4 w-4 relative z-10" />
              </div>
              <div className="mt-1 rounded bg-[#0b132b] px-2 py-1 text-[9px] font-bold text-white shadow-md">
                DH-204
              </div>
            </div>

            <div className="absolute right-[18%] bottom-[24%] flex flex-col items-center">
              <div className="rounded-full border-2 border-white bg-[#e63946] p-2 text-white shadow-lg">
                <Ambulance className="h-4 w-4" />
              </div>
              <div className="mt-1 rounded bg-[#0b132b] px-2 py-1 text-[9px] font-bold text-white shadow-md">
                DH-418
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl bg-[#0b132b]/90 px-4 py-3 text-xs text-white shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="font-semibold">GPS telemetry synchronized</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <span className="text-slate-300">Last update: 12 seconds ago</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Settings2 className="h-3.5 w-3.5 mr-1" /> Map layers
              </Button>
            </div>
          </div>
        </div>

        {/* Online Vehicles Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#E63946]" /> Online Vehicles
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                62 active
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by ID, name or area..." 
                className="pl-9 bg-white text-xs h-9 rounded-xl border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[440px]">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map(v => (
                <div key={v.id} className="p-4 hover:bg-slate-50/70 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-[#E63946] transition-colors">{v.name}</div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 rounded">{v.id}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        {v.operator} <span className="text-slate-300">•</span> <MapPin className="h-3 w-3" /> {v.area}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", getTypeColor(v.type))}>
                      {v.type}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full animate-pulse",
                        v.status === 'Online' ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-[#E63946] shadow-[0_0_5px_rgba(230,57,70,0.5)]"
                      )} />
                      <span className="text-[10px] font-bold text-slate-600">{v.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No vehicles matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
