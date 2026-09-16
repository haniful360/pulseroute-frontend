'use client';

import { Info, Moon, Siren } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

interface VehicleClass {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  estArrivalMin: number;
}

const VEHICLE_CLASSES: VehicleClass[] = [
  {
    id: 'bls',
    name: 'Basic Life Support',
    baseFare: 900,
    perKmRate: 45,
    estArrivalMin: 12,
  },
  {
    id: 'ac',
    name: 'AC Patient Transport',
    baseFare: 1200,
    perKmRate: 55,
    estArrivalMin: 15,
  },
  {
    id: 'icu',
    name: 'Mobile ICU',
    baseFare: 3500,
    perKmRate: 120,
    estArrivalMin: 22,
  },
  {
    id: 'ccu',
    name: 'Cardiac CCU',
    baseFare: 4200,
    perKmRate: 135,
    estArrivalMin: 18,
  },
  {
    id: 'neonatal',
    name: 'Neonatal Transport',
    baseFare: 4800,
    perKmRate: 140,
    estArrivalMin: 25,
  },
  {
    id: 'freezer',
    name: 'Freezer Van',
    baseFare: 2500,
    perKmRate: 70,
    estArrivalMin: 30,
  },
];

export const InteractiveFareCalculator: React.FC = () => {
  const [distance, setDistance] = useState<number>(8);
  const [selectedClassId, setSelectedClassId] = useState<string>('icu');
  const [surgeActive, setSurgeActive] = useState<boolean>(false);

  const selectedClass = useMemo(
    () => VEHICLE_CLASSES.find((v) => v.id === selectedClassId) || VEHICLE_CLASSES[2],
    [selectedClassId],
  );

  const { distanceFare, surgeAmount, total, rangeMin, rangeMax } = useMemo(() => {
    const distFare = selectedClass.perKmRate * distance;
    const base = selectedClass.baseFare;
    const rawSubtotal = base + distFare;
    const surge = surgeActive ? Math.round(rawSubtotal * 0.25) : 0;
    const calculatedTotal = rawSubtotal + surge;

    // Locked range margins matching Figma proportions (~6% lower, ~16% higher)
    const min = Math.round(calculatedTotal * 0.94);
    const max = Math.round(calculatedTotal * 1.16);

    return {
      distanceFare: distFare,
      subtotal: rawSubtotal,
      surgeAmount: surge,
      total: calculatedTotal,
      rangeMin: min,
      rangeMax: max,
    };
  }, [selectedClass, distance, surgeActive]);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Calculator Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls Column */}
            <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10">
              {/* Distance Slider */}
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-sm font-bold text-slate-900">Trip distance</span>
                  <span className="text-base font-extrabold text-red-600">{distance} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600 focus:outline-none"
                  aria-label="Trip distance slider"
                />
                <div className="flex justify-between pt-2 text-[11px] font-medium text-slate-400">
                  <span>1 km</span>
                  <span>100 km</span>
                </div>
              </div>

              {/* Vehicle Class Selector */}
              <div className="mt-8">
                <span className="block text-sm font-bold text-slate-900">Vehicle class</span>
                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {VEHICLE_CLASSES.map((item) => {
                    const isSelected = item.id === selectedClassId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedClassId(item.id)}
                        className={`flex items-center justify-between rounded-xl p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-2 border-red-500 bg-red-50/20 shadow-xs'
                            : 'border border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span
                            className={`block text-xs font-bold ${
                              isSelected ? 'text-slate-900' : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-slate-500">
                            BDT {item.baseFare.toLocaleString()} + {item.perKmRate}/km
                          </span>
                        </div>
                        <Siren
                          className={`h-4 w-4 flex-shrink-0 ${
                            isSelected ? 'text-red-500' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Night / Emergency Surge Toggle */}
              <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Night / emergency surge
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      11pm–6am and peak-load hours · +25%
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setSurgeActive(!surgeActive)}
                  role="switch"
                  aria-checked={surgeActive}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    surgeActive ? 'bg-red-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      surgeActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right Receipt / Breakdown Column */}
            <div className="flex flex-col justify-between bg-slate-950 p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div>
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white">Fare breakdown</h3>
                  <p className="text-xs text-slate-400">{selectedClass.name}</p>
                </div>

                {/* Line Items */}
                <div className="space-y-3 py-5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base fare</span>
                    <span className="font-semibold text-white">
                      BDT {selectedClass.baseFare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {selectedClass.perKmRate}/km × {distance} km
                    </span>
                    <span className="font-semibold text-white">
                      BDT {distanceFare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak surge</span>
                    <span
                      className={`font-semibold ${surgeActive ? 'text-amber-400' : 'text-slate-400'}`}
                    >
                      {surgeActive ? `+ BDT ${surgeAmount.toLocaleString()} (25%)` : '—'}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Est. arrival</span>
                      <span className="font-semibold text-white">
                        ~{selectedClass.estArrivalMin} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Estimate Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                  <span className="block text-xs text-slate-400">Total estimate</span>
                  <span className="mt-1 block text-3xl font-extrabold tracking-tight text-white">
                    BDT {total.toLocaleString()}
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-400">
                    Locked range BDT {rangeMin.toLocaleString()} – {rangeMax.toLocaleString()}
                  </span>
                </div>

                {/* Guarantee */}
                <div className="mt-4 flex items-start gap-2 text-[11px] leading-tight text-slate-400">
                  <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  <span>Transparent Pricing Guarantee — no roadside renegotiation</span>
                </div>
              </div>

              {/* Book CTA Button */}
              <div className="pt-6">
                <Link
                  href="/#booking"
                  className="block w-full rounded-xl bg-red-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-red-950/50 transition-all hover:bg-red-700 hover:shadow-xl"
                >
                  Book This Ride
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
