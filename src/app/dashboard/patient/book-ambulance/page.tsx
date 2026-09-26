'use client';

import { Button } from '@/components/ui/button';
import {
  Ambulance,
  ChevronDown,
  CircleHelp,
  Cross,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Siren,
  Snowflake,
  Stethoscope,
  Users,
  X,
  ZoomOut,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ambulanceTypes = [
  { label: 'BASIC', icon: Ambulance },
  { label: 'AC', icon: Snowflake },
  { label: 'ICU', icon: Cross },
  { label: 'CCU', icon: Stethoscope },
  { label: 'NEONATAL', icon: Users },
  { label: 'FREEZER', icon: Snowflake },
];

const requirements = ['High-Flow Oxygen', 'Cardiac Monitoring', 'Wheelchair', 'Unconscious'];

export default function BookAmbulancePage() {
  const [selectedType, setSelectedType] = useState('ICU');
  const [selectedRequirements, setSelectedRequirements] = useState([
    'Cardiac Monitoring',
    'Unconscious',
  ]);

  const toggleRequirement = (requirement: string) => {
    setSelectedRequirements((current) =>
      current.includes(requirement)
        ? current.filter((item) => item !== requirement)
        : [...current, requirement],
    );
  };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] text-[#0b132b] sm:-m-6 lg:-m-8">
      <div className="flex flex-1 flex-col lg:flex-row">
        <section className="w-full border-b border-[#e5e7eb] bg-white p-4 lg:w-[326px] lg:border-r lg:border-b-0 lg:p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#64748b] uppercase">
                Emergency dispatch
              </p>
              <h1 className="mt-1 text-lg font-bold">Booking Cockpit</h1>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold tracking-wide text-emerald-600 uppercase">
              System ready
            </span>
          </div>

          <div className="space-y-4 rounded-xl border border-[#e5e7eb] p-3 shadow-sm">
            <label className="block text-[10px] font-bold tracking-wide text-[#64748b] uppercase">
              Pickup location
              <span className="mt-1 flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 text-xs font-medium tracking-normal text-[#0b132b] normal-case">
                <MapPin className="h-4 w-4 text-[#e63946]" /> Road 27, House 42, Dhanmondi, Dhaka
              </span>
              <button className="mt-1 flex items-center gap-1 text-[10px] font-bold tracking-normal text-[#e63946] normal-case">
                <Navigation className="h-3 w-3" /> Use current location
              </button>
            </label>
            <label className="block text-[10px] font-bold tracking-wide text-[#64748b] uppercase">
              Destination hospital
              <span className="mt-1 flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-xs font-medium tracking-normal text-[#0b132b] normal-case">
                <span className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#64748b]" /> United Hospital, Gulshan
                </span>
                <ChevronDown className="h-4 w-4" />
              </span>
            </label>
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-wide text-[#64748b] uppercase">
                Ambulance category
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ambulanceTypes.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedType(label)}
                    className={`relative flex h-[58px] flex-col items-center justify-center gap-1 rounded-lg border text-[9px] font-bold transition ${selectedType === label ? 'border-[#e63946] bg-red-50 text-[#e63946]' : 'border-[#edf0f3] bg-[#f9fafb] text-[#0b132b] hover:border-red-200'}`}
                  >
                    <Icon className="h-5 w-5 text-[#64748b]" />
                    {label}
                    {selectedType === label && (
                      <span className="absolute -top-1 -right-1 rounded-full bg-[#e63946] p-0.5 text-white">
                        <ShieldCheck className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-wide text-[#64748b] uppercase">
                Patient requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {requirements.map((requirement) => {
                  const selected = selectedRequirements.includes(requirement);
                  return (
                    <button
                      key={requirement}
                      onClick={() => toggleRequirement(requirement)}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${selected ? 'bg-[#0b132b] text-white' : 'bg-[#f3f4f6] text-[#0b132b]'}`}
                    >
                      {requirement}
                      {selected && <X className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-end justify-between rounded-lg border border-[#edf0f3] bg-[#f9fafb] p-3">
              <div>
                <p className="text-[9px] font-bold tracking-wide text-[#64748b] uppercase">
                  Estimated fare
                </p>
                <p className="text-lg font-bold">
                  BDT 3,500{' '}
                  <span className="ml-1 text-[9px] text-emerald-500 uppercase">Locked</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold tracking-wide text-[#64748b] uppercase">ETA</p>
                <p className="text-xs font-bold">8-12 mins</p>
              </div>
            </div>
            <Link
              href="/dashboard/patient/active-trip"
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#e63946] text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
            >
              <Siren className="h-4 w-4" /> Confirm Emergency Dispatch
            </Link>
          </div>
        </section>
        <section className="relative min-h-[470px] flex-1 overflow-hidden bg-[#d5d6dc]">
          <div className="absolute inset-0 bg-[url('/images/hero-map.png')] bg-cover bg-center opacity-60 grayscale-[0.25]" />
          <div className="absolute inset-0 bg-[#c9cad1]/30" />
          <div className="absolute top-4 right-4 w-[184px] rounded-xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase">
                Coverage status
              </p>
              <span className="rounded bg-emerald-50 px-1.5 py-1 text-[8px] font-bold text-emerald-500">
                Live
              </span>
            </div>
            <div className="mt-3 space-y-2 text-[10px] font-semibold">
              <p>
                <span className="mr-2 text-[#e63946]">●</span>ICU Crews{' '}
                <b className="float-right">14 nearby</b>
              </p>
              <p>
                <span className="mr-2 text-[#64748b]">●</span>Traffic Impact{' '}
                <b className="float-right text-[#e63946]">High (+4m)</b>
              </p>
            </div>
            <p className="mt-4 text-[9px] leading-relaxed text-[#94a3b8]">
              Average dispatch delay in Dhanmondi is currently{' '}
              <b className="text-[#0b132b]">22 seconds.</b>
            </p>
          </div>
          <div className="absolute top-[45%] left-[48%] flex flex-col items-center">
            <div className="rounded-lg bg-[#e63946] p-2 text-white shadow-lg">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="mt-2 rounded bg-white px-2 py-1 text-[10px] font-bold shadow">
              Your Current Location
            </span>
          </div>
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <Button variant="outline" size="icon-sm" className="bg-white">
              <Plus />
            </Button>
            <Button variant="outline" size="icon-sm" className="bg-white">
              <ZoomOut />
            </Button>
            <Button variant="outline" size="icon-sm" className="bg-white">
              <CircleHelp />
            </Button>
          </div>
        </section>
      </div>
      <div className="flex h-12 items-center justify-between border-t border-[#e5e7eb] bg-white px-4 text-xs text-[#64748b] sm:px-6">
        <div className="flex items-center gap-2 font-bold text-[#0b132b]">
          <span className="rounded bg-[#e63946] p-1 text-white">
            <Ambulance className="h-4 w-4" />
          </span>
          Pulse<span className="text-[#e63946]">Route</span>
        </div>
        <span className="hidden sm:block">Emergency dispatch is monitored 24/7</span>
        <Link href="/dashboard/patient/medical-profile" className="font-semibold text-[#e63946]">
          Review medical profile
        </Link>
      </div>
    </div>
  );
}
