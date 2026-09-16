'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Crosshair,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Ambulance,
  AlertCircle,
  Check,
  FileText,
} from 'lucide-react';

interface VehicleOption {
  id: string;
  label: string;
  baseFare: string;
}

const VEHICLE_TYPES: VehicleOption[] = [
  { id: 'basic', label: 'Basic', baseFare: '900 - 1,200' },
  { id: 'ac', label: 'AC', baseFare: '1,200 - 1,600' },
  { id: 'icu', label: 'ICU', baseFare: '3,500 - 4,320' },
  { id: 'ccu', label: 'CCU', baseFare: '4,200 - 5,100' },
  { id: 'neonatal', label: 'Neonatal', baseFare: '4,800 - 5,800' },
  { id: 'freezer', label: 'Freezer', baseFare: '2,500 - 3,200' },
];

type SeverityLevel = 'stable' | 'urgent' | 'critical';

export const HeroSection: React.FC = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('icu');
  const [severity, setSeverity] = useState<SeverityLevel>('critical');
  const [notesOpen, setNotesOpen] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPickupAddress('House 42, Road 11, Banani, Dhaka');
          setIsLocating(false);
        },
        () => {
          setPickupAddress('House 42, Road 11, Banani, Dhaka');
          setIsLocating(false);
        },
        { timeout: 3000 },
      );
    } else {
      setPickupAddress('House 42, Road 11, Banani, Dhaka');
      setIsLocating(false);
    }
  };

  const handleFindAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBooked(true);
    }, 1200);
  };

  const activeVehicle = VEHICLE_TYPES.find((v) => v.id === selectedVehicle) || VEHICLE_TYPES[2];

  return (
    <section
      id="booking"
      className="relative overflow-hidden bg-[#090D16] pt-8 pb-16 text-white lg:py-20"
    >
      {/* Background Map Graphic Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/hero-map.png"
          alt="Dhaka Map Dispatch Grid"
          fill
          priority
          className="object-cover object-center mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/70 via-transparent to-[#090D16]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090D16] via-[#090D16]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Content */}
          <div className="space-y-6 lg:col-span-7 lg:space-y-8">
            {/* Live City Dispatch Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Dispatch network live in 12 cities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl xl:text-[54px]">
              Every second counts — <br className="hidden sm:inline" />
              <span className="text-white">instant emergency ambulance dispatch near you.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Verified crews, live GPS telemetry and a fare locked before you move. No phone tree,
              no roadside bargaining.
            </p>

            {/* Key Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 pt-2 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Median dispatch</div>
                  <div className="text-sm font-bold text-white sm:text-base">22 sec</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Crew verification</div>
                  <div className="text-sm font-bold text-white sm:text-base">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Ambulance Request Card */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Request an ambulance</h3>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600"></span>
                  <span>412 crews online</span>
                </div>
              </div>

              {booked ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Dispatch Initiated!</h4>
                  <p className="text-sm text-slate-600">
                    Finding the closest {activeVehicle.label} ambulance near{' '}
                    {pickupAddress || 'your area'}. A paramedic is being assigned.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBooked(false)}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Create Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFindAmbulance} className="mt-4 space-y-4">
                  {/* Pickup Address */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Pickup address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="Building, road, area"
                        required
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                      />
                    </div>
                    {/* Use Current Location trigger */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                      <Crosshair className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Locating...' : 'Use current location'}</span>
                    </button>
                  </div>

                  {/* Destination Hospital */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Destination hospital
                    </label>
                    <div className="relative">
                      <select
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-9 pl-3.5 text-sm text-slate-900 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                      >
                        <option value="">Search hospitals & clinics</option>
                        <option value="square">Square Hospital, Panthapath</option>
                        <option value="evercare">Evercare Hospital, Bashundhara</option>
                        <option value="united">United Hospital, Gulshan 2</option>
                        <option value="dmc">Dhaka Medical College Hospital (DMCH)</option>
                        <option value="bsmmu">BSMMU (PG Hospital), Shahbag</option>
                        <option value="labaid">Labaid Specialized Hospital, Dhanmondi</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Ambulance Type Chips */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Ambulance type
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                      {VEHICLE_TYPES.map((v) => {
                        const isSelected = selectedVehicle === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVehicle(v.id)}
                            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-2 border-red-600 bg-red-50 font-bold text-red-700'
                                : 'border border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-red-600" />}
                            <span>{v.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Severity */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Emergency severity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSeverity('stable')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'stable'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Stable
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeverity('urgent')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'urgent'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Urgent
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeverity('critical')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'critical'
                            ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Critical
                      </button>
                    </div>
                  </div>

                  {/* Patient notes expandable */}
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNotesOpen(!notesOpen)}
                      className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>Patient notes for the crew</span>
                      </div>
                      {notesOpen ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>

                    {notesOpen && (
                      <div className="border-t border-slate-200 bg-slate-50 p-3">
                        <textarea
                          rows={2}
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          placeholder="Symptoms, floor number, oxygen needed..."
                          className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Estimated Fare & Route */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-1 text-xs">
                    <div>
                      <span className="block text-slate-500">
                        Estimated fare - {activeVehicle.label}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        BDT {activeVehicle.baseFare}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-slate-400">Route</span>
                      <span className="font-semibold text-slate-700">1.9 km ~8 min</span>
                    </div>
                  </div>

                  {/* Primary Find Nearest Ambulance CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 active:scale-[0.99]"
                  >
                    <Ambulance className="h-4 w-4" />
                    <span>
                      {isSubmitting ? 'Locating Nearest Ambulance...' : 'Find Nearest Ambulance'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
