'use client';

import React, { useState } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Switch } from '@/components/ui/switch';
import { Bell, MapPin, Radio, Shield, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverSettingsView() {
  const [autoAccept, setAutoAccept] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [trafficRadar, setTrafficRadar] = useState(true);
  const [nightModeMap, setNightModeMap] = useState(false);
  const [maxDispatchRadius, setMaxDispatchRadius] = useState('15');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cockpit preferences saved successfully.');
  };

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Driver Cockpit Settings"
        description="Configure dispatch alert volumes, radar tones, emergency auto-accept preferences, and night overlays."
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* Dispatch Preferences */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dispatch Automation &amp; Range</h3>
                <p className="text-xs text-slate-500">Tune how emergency calls are routed to your ambulance</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Emergency Auto-Accept</p>
                  <p className="text-xs text-slate-500">Automatically lock in incoming ICU emergencies within 3km</p>
                </div>
                <Switch
                  checked={autoAccept}
                  onCheckedChange={setAutoAccept}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">High-Demand Zone Radar</p>
                  <p className="text-xs text-slate-500">Highlight high emergency demand zones (Dhanmondi, Gulshan, Mohakhali)</p>
                </div>
                <Switch
                  checked={trafficRadar}
                  onCheckedChange={setTrafficRadar}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="pt-2">
                <InputField
                  label="Maximum Dispatch Radius (km)"
                  type="number"
                  value={maxDispatchRadius}
                  onChange={(e) => setMaxDispatchRadius(e.target.value)}
                  placeholder="e.g. 15"
                  helperText="Default dispatch search perimeter around current GPS coordinate."
                />
              </div>
            </div>
          </div>

          {/* Audio & Display */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Volume2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Audio Radar &amp; Visual Alerts</h3>
                <p className="text-xs text-slate-500">Custom siren chimes and high-contrast cockpit maps</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">High-Decibel Siren Chime</p>
                  <p className="text-xs text-slate-500">Loud priority tone overrides device silent mode on emergency dispatch</p>
                </div>
                <Switch
                  checked={soundAlerts}
                  onCheckedChange={setSoundAlerts}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Dark Navigation Map Overlay</p>
                  <p className="text-xs text-slate-500">Reduce eye strain during night duty shifts with dark radar UI</p>
                </div>
                <Switch
                  checked={nightModeMap}
                  onCheckedChange={setNightModeMap}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Save Configuration</h4>
            <p className="mt-1 text-xs text-slate-500">Changes take effect immediately on your active radar session.</p>

            <div className="mt-6 space-y-3">
              <DynamicActionButton
                type="submit"
                variant="danger"
                label="Save Preferences"
                fullWidth
              />
              <DynamicActionButton
                type="button"
                variant="outline"
                onClick={() => {
                  setAutoAccept(false);
                  setSoundAlerts(true);
                  setTrafficRadar(true);
                  setNightModeMap(false);
                  setMaxDispatchRadius('15');
                  toast.info('Preferences reset to default values.');
                }}
                label="Reset to Default"
                fullWidth
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
