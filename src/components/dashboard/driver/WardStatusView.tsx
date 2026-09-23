'use client';

import React, { useState } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  Activity,
  Bed,
  Building2,
  CheckCircle2,
  HeartPulse,
  Phone,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface HospitalWard {
  hospitalName: string;
  zone: string;
  icuBeds: number;
  ccuBeds: number;
  generalBeds: number;
  erTriageStatus: 'Normal' | 'Critical Load' | 'Accepting Priority';
  erHotline: string;
}

const hospitals: HospitalWard[] = [
  {
    hospitalName: 'United Hospital',
    zone: 'Gulshan-2, Dhaka',
    icuBeds: 4,
    ccuBeds: 2,
    generalBeds: 18,
    erTriageStatus: 'Accepting Priority',
    erHotline: '+880 2 8836000',
  },
  {
    hospitalName: 'Square Hospital',
    zone: 'Panthapath, Dhaka',
    icuBeds: 2,
    ccuBeds: 1,
    generalBeds: 9,
    erTriageStatus: 'Normal',
    erHotline: '+880 2 8159457',
  },
  {
    hospitalName: 'Evercare Hospital Dhaka',
    zone: 'Bashundhara R/A, Dhaka',
    icuBeds: 6,
    ccuBeds: 4,
    generalBeds: 25,
    erTriageStatus: 'Accepting Priority',
    erHotline: '+880 2 8431661',
  },
  {
    hospitalName: 'Dhaka Medical College Hospital',
    zone: 'Bakshibazar, Dhaka',
    icuBeds: 1,
    ccuBeds: 0,
    generalBeds: 4,
    erTriageStatus: 'Critical Load',
    erHotline: '+880 2 55165088',
  },
];

export default function WardStatusView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.zone.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Hospital Ward &amp; ER Bed Telemetry"
          description="Live availability of ICU, CCU, and NICU beds with emergency triage status across Dhaka hospitals."
        />
        <div className="relative self-start sm:self-auto">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospitals or zones..."
            className="h-10 w-full sm:w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Hospitals */}
      <div className="grid gap-5 md:grid-cols-2">
        {filteredHospitals.map((h, idx) => {
          const statusColor =
            h.erTriageStatus === 'Critical Load'
              ? '#ef4444'
              : h.erTriageStatus === 'Accepting Priority'
                ? '#10b981'
                : '#3b82f6';

          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{h.hospitalName}</h4>
                      <p className="text-xs text-slate-500">{h.zone}</p>
                    </div>
                  </div>
                  <DynamicBadge text={h.erTriageStatus} color={statusColor} size="xs" />
                </div>

                {/* Capacity Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ICU BEDS</p>
                    <p className="mt-1 text-xl font-black text-slate-900">{h.icuBeds}</p>
                    <span className="text-[10px] font-semibold text-emerald-600">Available</span>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">CCU BEDS</p>
                    <p className="mt-1 text-xl font-black text-slate-900">{h.ccuBeds}</p>
                    <span className="text-[10px] font-semibold text-emerald-600">Available</span>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">GENERAL ER</p>
                    <p className="mt-1 text-xl font-black text-slate-900">{h.generalBeds}</p>
                    <span className="text-[10px] font-semibold text-blue-600">Open</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {h.erHotline}
                </span>
                <DynamicActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(`Contacting ${h.hospitalName} ER triage desk...`)}
                  label="Reserve ER Bed"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
