'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Ambulance, HeartPulse, Wind, Wrench, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const fleetData = [
  { id: 'DH-102', name: 'Pulse ICU 102', operator: 'PulseRoute', type: 'ICU', status: 'Online', lastService: 'Sep 15, 2026' },
  { id: 'DH-204', name: 'Care AC 204', operator: 'Care Ambulance', type: 'AC', status: 'Online', lastService: 'Sep 10, 2026' },
  { id: 'DH-311', name: 'Metro BLS 311', operator: 'Metro Health', type: 'Basic', status: 'Maintenance', lastService: 'Aug 28, 2026' },
  { id: 'DH-418', name: 'Pulse CCU 418', operator: 'PulseRoute', type: 'CCU', status: 'Online', lastService: 'Sep 18, 2026' },
  { id: 'DH-105', name: 'Pulse ICU 105', operator: 'PulseRoute', type: 'ICU', status: 'On Dispatch', lastService: 'Sep 12, 2026' },
  { id: 'DH-209', name: 'Care AC 209', operator: 'Care Ambulance', type: 'AC', status: 'Online', lastService: 'Sep 08, 2026' },
  { id: 'DH-315', name: 'Metro BLS 315', operator: 'Metro Health', type: 'Basic', status: 'Offline', lastService: 'Aug 20, 2026' },
  { id: 'DH-422', name: 'Pulse ICU 422', operator: 'PulseRoute', type: 'ICU', status: 'On Dispatch', lastService: 'Sep 19, 2026' },
  { id: 'DH-510', name: 'United AC 510', operator: 'United Healthcare', type: 'AC', status: 'Maintenance', lastService: 'Aug 30, 2026' },
];

export default function FleetView() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Online', 'On Dispatch', 'Maintenance', 'Offline'];

  const filteredFleet = useMemo(() => {
    return fleetData.filter(vehicle => {
      const matchesTab = activeTab === 'All' || vehicle.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = vehicle.id.toLowerCase().includes(searchLower) ||
                            vehicle.name.toLowerCase().includes(searchLower) ||
                            vehicle.operator.toLowerCase().includes(searchLower);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Ambulance Fleet Management
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Monitor, dispatch, and manage ambulance availability and maintenance schedules.
          </p>
        </div>
        <Button variant="danger" className="shrink-0 h-11 px-5 rounded-2xl">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total vehicles */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Total vehicles</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Ambulance className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">84</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">100% tracked</div>
          </div>
        </div>

        {/* ICU units */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">ICU units</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">32</div>
            <div className="mt-1 text-xs font-medium text-amber-600">4 due for audit</div>
          </div>
        </div>

        {/* AC units */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">AC units</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wind className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">28</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">All compliant</div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Maintenance</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">6</div>
            <div className="mt-1 text-xs font-medium text-red-600">2 overdue</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold transition-all',
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search vehicles, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl bg-white pl-9 text-xs shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFleet.map((vehicle) => (
          <div key={vehicle.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">
                  {vehicle.id}
                </span>
              </div>
              <div className="relative flex h-2.5 w-2.5">
                {(vehicle.status === 'Online' || vehicle.status === 'On Dispatch') && (
                  <span className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse",
                    vehicle.status === 'Online' ? 'bg-emerald-400' : 'bg-blue-400'
                  )}></span>
                )}
                <span className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  vehicle.status === 'Online' && 'bg-emerald-500',
                  vehicle.status === 'On Dispatch' && 'bg-blue-500',
                  vehicle.status === 'Maintenance' && 'bg-amber-500',
                  vehicle.status === 'Offline' && 'bg-slate-400'
                )}></span>
              </div>
            </div>
            
            <div className="mt-3">
              <h3 className="text-sm font-bold text-slate-900">{vehicle.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{vehicle.operator}</p>
            </div>

            <div className="border-t border-dashed border-slate-200 my-3"></div>

            <div className="flex items-center justify-between">
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                vehicle.type === 'ICU' && "bg-red-50 text-[#E63946] border-red-200",
                vehicle.type === 'AC' && "bg-blue-50 text-blue-600 border-blue-200",
                vehicle.type === 'Basic' && "bg-slate-100 text-slate-600 border-slate-200",
                vehicle.type === 'CCU' && "bg-purple-50 text-purple-600 border-purple-200"
              )}>
                {vehicle.type}
              </span>

              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                vehicle.status === 'Online' && "bg-emerald-50 text-emerald-600",
                vehicle.status === 'On Dispatch' && "bg-blue-50 text-blue-600",
                vehicle.status === 'Maintenance' && "bg-amber-50 text-amber-600",
                vehicle.status === 'Offline' && "bg-slate-100 text-slate-600"
              )}>
                {vehicle.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
