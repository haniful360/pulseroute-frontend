'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  HeartPulse,
  PenTool,
  ShieldCheck,
  Truck,
  Wind,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMyDriverProfileAction } from '@/services/driver.service';

export default function AmbulanceProfileView() {
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getMyDriverProfileAction();
        if (res.success && res.data) {
          setDriver(res.data);
        }
      } catch (err) {
        console.error('Failed to load ambulance profile:', err);
      }
    }
    loadProfile();
  }, []);

  const vehicle = driver?.currentVehicle;

  const equipment = [
    { name: 'Hamilton-T1 Transport Ventilator', status: 'Operational', icon: Wind, date: 'Inspected 2 days ago' },
    { name: 'ZOLL X Series Defibrillator / Monitor', status: 'Operational', icon: Zap, date: 'Battery 98%' },
    { name: 'Dual Oxygen Cylinder Unit (4000L)', status: 'Operational', icon: HeartPulse, date: 'Pressure 150 bar' },
    { name: 'Suction Unit & Intubation Kit', status: 'Operational', icon: Activity, date: 'Sterilized' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Ambulance Profile & Medical Inventory"
          description="Unit specifications, life-support equipment checklist, and BRTA fitness records."
        />
        <DynamicActionButton
          variant="danger"
          icon={PenTool}
          iconPosition="left"
          onClick={() => toast.success('Equipment maintenance log updated.')}
          label="Log Inspection"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Hero Unit Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#E63946] sm:h-20 sm:w-20">
              <Truck className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                  {vehicle?.vehicleNumber || 'ICU Unit DHA-129'}
                </h3>
                <DynamicBadge
                  text={vehicle?.isVerified ? 'BRTA Verified' : 'BRTA Approved'}
                  color="#10b981"
                  size="sm"
                  icon={ShieldCheck}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {vehicle?.model || 'Mercedes-Benz Sprinter 316 CDI'} • {vehicle?.ambulanceType || 'ICU'} Advanced Life Support
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <span>Registration: <b className="font-mono text-slate-900">{vehicle?.registrationNumber || 'DH-AMB-2024'}</b></span>
                <span>•</span>
                <span>Status: <b className="text-emerald-600">{vehicle?.status || 'ACTIVE'}</b></span>
                <span>•</span>
                <span>Fuel Level: <b className="text-emerald-600">85% Full</b></span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center sm:min-w-[180px]">
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">FITNESS CERTIFICATE</p>
            <p className="mt-1 text-sm font-bold text-emerald-700">Valid till Nov 2025</p>
            <p className="text-[10px] text-emerald-600">Tax Token: Updated</p>
          </div>
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900">Active ICU Medical Equipment</h4>
            <p className="text-xs text-slate-500">Critical diagnostic and life-support devices aboard unit DHA-129</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> 4/4 Ready for Duty
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {equipment.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#E63946] shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.date}</p>
                  </div>
                </div>
                <DynamicBadge text={item.status} color="#10b981" size="xs" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
