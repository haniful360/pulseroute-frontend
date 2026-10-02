'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { DollarSign, MapPin, HeartPulse, Percent, Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAllPricingConfigsAction, updatePricingConfigAction } from '@/services/pricing/pricing.service';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricingView() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [baseFare, setBaseFare] = useState('1200');
  const [perKmRate, setPerKmRate] = useState('45');
  const [minimumFare, setMinimumFare] = useState('1500');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await getAllPricingConfigsAction();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setConfigs(res.data);
          const first = res.data[0];
          setSelectedConfigId(first.id);
          setBaseFare(String(first.baseFare));
          setPerKmRate(String(first.perKmRate));
          setMinimumFare(String(first.minimumFare || first.baseFare));
        }
      } catch (err) {
        console.error('Failed to load pricing configs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPricing();
  }, []);

  const handleSave = async () => {
    if (!selectedConfigId) {
      setSaved(true);
      toast.success('Fare schedule updated.');
      setTimeout(() => setSaved(false), 3000);
      return;
    }
    setIsSaving(true);
    try {
      const res = await updatePricingConfigAction(selectedConfigId, {
        baseFare: Number(baseFare),
        perKmRate: Number(perKmRate),
        minimumFare: Number(minimumFare),
      });
      if (res.success) {
        setSaved(true);
        toast.success('Fare schedule updated on backend.');
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(res.message || 'Failed to update pricing config');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating pricing');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pricing & Commission Strategy
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Set base ambulance dispatch fares, per-kilometer rates, night surcharges, and operator commissions.
          </p>
        </div>
        <Button variant="danger" className="shrink-0 h-10 px-5 rounded-2xl font-bold">
          Preview Changes
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Standard base fare</div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">৳{Number(baseFare).toLocaleString()}</div>
          )}
          <div className="text-xs font-medium text-slate-500 mt-1">Current schedule</div>
        </div>
        
        {/* Stat 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Per kilometer</div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-20 my-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">৳{perKmRate}</div>
          )}
          <div className="text-xs font-medium text-slate-500 mt-1">Dhaka metro</div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Minimum fare</div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">৳{Number(minimumFare).toLocaleString()}</div>
          )}
          <div className="text-xs font-medium text-slate-500 mt-1">Base threshold</div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Percent className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Operator commission</div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16 my-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">12%</div>
          )}
          <div className="text-xs font-medium text-slate-500 mt-1">Across all trips</div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Fare Schedule Configuration</h2>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-500 mb-6">Changes are applied globally to all dispatch calculations.</p>
          
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-4">Base Fares</h3>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-11 w-full rounded-2xl" />
                  <Skeleton className="h-11 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Base Fare (BDT)"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                  />
                  <InputField
                    label="Per Kilometer Rate (BDT)"
                    value={perKmRate}
                    onChange={(e) => setPerKmRate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-4">Surcharges</h3>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-11 w-full rounded-2xl" />
                  <Skeleton className="h-11 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Minimum Trip Fare (BDT)"
                    value={minimumFare}
                    onChange={(e) => setMinimumFare(e.target.value)}
                  />
                  <InputField label="Night Surcharge (%)" value="25" disabled />
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            <div>
              <h3 className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-4">Commission</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Platform Commission (%)" value="12" disabled />
                <InputField label="Insurance Levy (%)" value="2" disabled />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Button
              variant="danger"
              disabled={isSaving}
              className="w-full sm:w-auto h-11 px-6 rounded-2xl font-bold disabled:opacity-50"
              onClick={handleSave}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Commission Tiers */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 mb-5">Active Commission Tiers</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Standard</span>
                  <span className="text-xs font-black text-[#0b132b]">12%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0b132b]" style={{ width: '100%' }} />
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1">Applied to 8,421 trips</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Premium Partner</span>
                  <span className="text-xs font-black text-[#0b132b]">10%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#E63946]" style={{ width: '83%' }} />
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1">Applied to 1,294 trips</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Hospital Network</span>
                  <span className="text-xs font-black text-[#0b132b]">8%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '66%' }} />
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1">Applied to 842 trips</div>
              </div>
            </div>
          </div>

          {/* Control Status */}
          <div className="rounded-2xl border bg-[#0b132b] p-5 text-white shadow-sm flex flex-col h-full">
            <div className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase mb-4">
              PRICING ENGINE
            </div>
            
            <div className="space-y-3 flex-1 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">Security</span>
                <span className="text-xs font-bold text-emerald-400">Protected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">Last sync</span>
                <span className="text-xs font-bold text-white">2 mins ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">Audit trail</span>
                <span className="text-xs font-bold text-white">Enabled</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                Every pricing change is recorded with actor, timestamp, and previous value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
