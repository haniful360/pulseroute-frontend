'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import {
  Ambulance,
  Check,
  ChevronDown,
  CircleHelp,
  Cross,
  Hospital,
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
import { toast } from 'sonner';

const ambulanceCategories = [
  { label: 'BASIC', icon: Ambulance, price: '1,500' },
  { label: 'AC', icon: Snowflake, price: '2,200' },
  { label: 'ICU', icon: Cross, price: '3,500' },
  { label: 'CCU', icon: Stethoscope, price: '4,000' },
  { label: 'NEONATAL', icon: Users, price: '4,500' },
  { label: 'FREEZER', icon: Snowflake, price: '3,800' },
];

const requirementsList = ['High-Flow Oxygen', 'Cardiac Monitoring', 'Wheelchair', 'Unconscious'];

export default function BookAmbulanceView() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState('Road 27, House 42, Dhanmondi, Dhaka');
  const [destinationHospital, setDestinationHospital] = useState('United Hospital, Gulshan-2');
  const [selectedCategory, setSelectedCategory] = useState('ICU');
  const [selectedRequirements, setSelectedRequirements] = useState([
    'Cardiac Monitoring',
    'Unconscious',
  ]);

  const toggleRequirement = (req: string) => {
    setSelectedRequirements((curr) =>
      curr.includes(req) ? curr.filter((item) => item !== req) : [...curr, req],
    );
  };

  const handleConfirmBooking = () => {
    toast.success('Emergency booking initiated! Redirecting to live tracking...');
    router.push('/dashboard/patient/active-trip');
  };

  const currentPrice =
    ambulanceCategories.find((c) => c.label === selectedCategory)?.price || '3,500';

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] sm:-m-6 lg:-m-8">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Booking Form Section */}
        <section className="w-full border-b border-slate-200 bg-white p-5 lg:w-[380px] lg:border-r lg:border-b-0 lg:p-6 overflow-y-auto">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                Emergency Dispatch
              </p>
              <h1 className="mt-1 text-xl font-black text-slate-900">Booking Cockpit</h1>
            </div>
            <DynamicBadge text="System Ready" color="#10b981" size="xs" />
          </div>

          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
            {/* Pickup Location */}
            <div>
              <InputField
                label="PICKUP LOCATION"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                icon={<MapPin className="h-4 w-4 text-[#e63946]" />}
                placeholder="Enter pickup address in Dhaka"
              />
              <button
                type="button"
                onClick={() => toast.info('GPS coordinate locked.')}
                className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#e63946] hover:underline"
              >
                <Navigation className="h-3 w-3" /> Use current GPS location
              </button>
            </div>

            {/* Destination Hospital */}
            <div>
              <InputField
                label="DESTINATION HOSPITAL"
                value={destinationHospital}
                onChange={(e) => setDestinationHospital(e.target.value)}
                icon={<Hospital className="h-4 w-4 text-blue-600" />}
                placeholder="Select or type hospital name"
              />
            </div>

            {/* Ambulance Category Selector */}
            <div>
              <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                AMBULANCE CATEGORY
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ambulanceCategories.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCategory(label)}
                    className={`relative flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-[10px] font-bold transition ${
                      selectedCategory === label
                        ? 'border-[#e63946] bg-red-50 text-[#e63946] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-red-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {selectedCategory === label && (
                      <span className="absolute -top-1 -right-1 rounded-full bg-[#e63946] p-0.5 text-white">
                        <ShieldCheck className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Requirements */}
            <div>
              <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                PATIENT REQUIREMENTS
              </p>
              <div className="flex flex-wrap gap-2">
                {requirementsList.map((req) => {
                  const selected = selectedRequirements.includes(req);
                  return (
                    <button
                      key={req}
                      type="button"
                      onClick={() => toggleRequirement(req)}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold transition ${
                        selected
                          ? 'bg-[#0b132b] text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {req}
                      {selected ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3 text-slate-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Fare & ETA */}
            <div className="flex items-end justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  ESTIMATED FARE
                </p>
                <p className="mt-0.5 text-xl font-black text-slate-900">
                  BDT {currentPrice}{' '}
                  <span className="ml-1 text-[10px] font-bold text-emerald-600 uppercase">Locked</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">ETA</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">8-12 mins</p>
              </div>
            </div>

            {/* Action Confirm Button */}
            <DynamicActionButton
              variant="danger"
              onClick={handleConfirmBooking}
              icon={Siren}
              iconPosition="left"
              label="Confirm Emergency Dispatch"
              fullWidth
              className="h-12 text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-500/25"
            />
          </div>
        </section>

        {/* Right Side: Map Radar Coverage Overview */}
        <section className="relative min-h-[470px] flex-1 overflow-hidden bg-[#d5d6dc]">
          <div className="absolute inset-0 bg-[url('/images/hero-map.png')] bg-cover bg-center opacity-70" />
          <div className="absolute inset-0 bg-slate-900/10" />

          {/* Floating Coverage Status Card */}
          <div className="absolute top-5 right-5 w-60 rounded-3xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <p className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase">
                Coverage Status
              </p>
              <DynamicBadge text="Live" color="#10b981" size="xs" />
            </div>
            <div className="mt-3 space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between">
                <span>ICU Fleet Available:</span>
                <b className="text-slate-900">14 units nearby</b>
              </div>
              <div className="flex justify-between">
                <span>Avg Dispatch Delay:</span>
                <b className="text-emerald-600">22 seconds</b>
              </div>
            </div>
          </div>

          {/* Location Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="rounded-2xl bg-[#e63946] p-3 text-white shadow-xl shadow-red-500/40">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md">
              Your Pickup Point
            </span>
          </div>

          {/* Map Controls */}
          <div className="absolute right-5 bottom-5 flex flex-col gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md hover:bg-slate-50 font-bold">
              +
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md hover:bg-slate-50 font-bold">
              −
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Footer */}
      <div className="flex h-12 items-center justify-between border-t border-slate-200 bg-white px-6 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-[#0b132b]">
          <span className="rounded-lg bg-[#e63946] p-1 text-white">
            <Ambulance className="h-4 w-4" />
          </span>
          Pulse<span className="text-[#e63946]">Route</span>
        </div>
        <span>Emergency dispatch is monitored 24/7</span>
        <Link href="/dashboard/patient/payment-methods" className="font-semibold text-[#e63946] hover:underline">
          Payment Methods &amp; Checkout
        </Link>
      </div>
    </div>
  );
}
