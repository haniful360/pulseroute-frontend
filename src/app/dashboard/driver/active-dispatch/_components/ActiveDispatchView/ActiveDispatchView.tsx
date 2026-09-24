'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import {
  Check,
  Crosshair,
  Hospital,
  Map,
  Navigation,
  Phone,
  Radio,
  Send,
  Siren,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ActiveDispatchView() {
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState('Traffic Congestion');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [isArrived, setIsArrived] = useState(false);

  const handleMarkArrived = () => {
    setIsArrived(true);
    toast.success('Status updated: Arrived at pickup location.');
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setIncidentModalOpen(false);
    toast.warning('Incident report logged to central emergency dispatch.');
  };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#cdd2d6] sm:-m-6 lg:-m-8">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Background Map Simulation */}
        <div className="absolute inset-0 bg-[url('/assets/dashboard/driver/dhaka_radar_map.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-900/15" />

        {/* Turn-by-Turn Guidance Navigation Card */}
        <div className="absolute top-4 left-4 z-10 w-[260px] overflow-hidden rounded-3xl bg-white shadow-2xl sm:top-5 sm:left-5 sm:w-[320px]">
          <div className="bg-[#0b132b] p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Next Turn Guidance
              </p>
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                Live Route
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-black text-white">450m</p>
              <span className="rounded-2xl bg-[#e63946] p-3 text-white shadow-md shadow-red-500/30">
                <Navigation className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-200">
              Turn right onto <b className="text-white">Banani Road 11</b>
            </p>
          </div>

          <div className="space-y-5 p-5 text-xs">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                ↑
              </span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">In 1.2 km</p>
                <p className="font-semibold text-slate-800">Continue straight on Kemal Ataturk Ave</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-slate-500">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                ↱
              </span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">In 2.1 km</p>
                <p className="font-semibold text-slate-700">Slight left toward Gulshan Circle 2</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-red-50 p-2 text-[#e63946]">
                <Hospital className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] font-bold text-[#e63946] uppercase">Target Hospital</p>
                <p className="font-bold text-slate-900">United Hospital, Gulshan</p>
                <p className="text-[10px] text-slate-500">ICU Bed #04 Reserved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Telemetry Ribbon */}
        <div className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#0b132b]/95 px-5 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          <span>En Route to Pickup</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300">6m ETA</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">2.4 km</span>
        </div>

        {/* Map Control Actions */}
        <div className="absolute top-5 right-4 z-10 flex flex-col gap-2">
          <Button size="icon" variant="outline" className="h-10 w-10 rounded-2xl bg-white/90 shadow-lg backdrop-blur-md hover:bg-white">
            <span className="text-lg leading-none font-bold">+</span>
          </Button>
          <Button size="icon" variant="outline" className="h-10 w-10 rounded-2xl bg-white/90 shadow-lg backdrop-blur-md hover:bg-white">
            <span className="text-lg leading-none font-bold">−</span>
          </Button>
          <Button size="icon" variant="outline" className="h-10 w-10 rounded-2xl bg-white/90 shadow-lg backdrop-blur-md hover:bg-white text-slate-700">
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Dispatch Action Bar */}
        <div className="absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 items-center gap-3 rounded-3xl border border-white/40 bg-white/95 p-3.5 shadow-2xl backdrop-blur-lg">
          <DynamicActionButton
            variant="danger"
            onClick={handleMarkArrived}
            className="h-12 flex-1 rounded-2xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-500/25"
            icon={Check}
            iconPosition="left"
            label={isArrived ? 'Arrived at Pickup Location' : 'Mark Arrived at Pickup'}
          />

          <DynamicActionButton
            variant="outline"
            onClick={() => setIncidentModalOpen(true)}
            className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            icon={Map}
            iconPosition="left"
            label="Incident Report"
          />
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs">
        <DynamicBackBtn label="Back to Duty Cockpit" />
        <span className="text-slate-400">Emergency Protocol Active • Unit DHA-129</span>
      </div>

      {/* Incident Report Modal */}
      <DynamicModal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        title="Report Route Incident"
        description="Notify Dhaka central dispatch of blockages, road accidents, or route deviations."
        variant="light"
      >
        <form onSubmit={handleReportIncident} className="space-y-4 pt-2">
          <InputField
            label="Incident Type"
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            placeholder="e.g. VIP Movement, Waterlogging, Road Construction"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Incident Notes & Details
            </label>
            <textarea
              value={incidentNotes}
              onChange={(e) => setIncidentNotes(e.target.value)}
              placeholder="Describe road conditions and requested alternative green corridor..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none min-h-[90px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <DynamicActionButton
              variant="outline"
              onClick={() => setIncidentModalOpen(false)}
              label="Cancel"
            />
            <DynamicActionButton
              type="submit"
              variant="danger"
              icon={Send}
              iconPosition="right"
              label="Submit Incident"
            />
          </div>
        </form>
      </DynamicModal>
    </div>
  );
}
