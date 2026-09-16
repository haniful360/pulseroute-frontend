import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ManifestClass {
  id: string;
  name: string;
  image: string;
  description: string;
  equipment: string[];
  startingPrice: number;
}

const MANIFEST_CLASSES: ManifestClass[] = [
  {
    id: 'bls',
    name: 'Basic Life Support',
    image: '/images/basic-life-support.png',
    description: 'Non-critical transfers with a trained attendant on board.',
    equipment: ['Oxygen Cylinder', 'Stretcher', 'First-Aid Kit', '+'],
    startingPrice: 900,
  },
  {
    id: 'ac',
    name: 'AC Patient Transport',
    image: '/images/ac-patient-transport.png',
    description: 'Climate-controlled cabin for longer inter-city transfers.',
    equipment: ['Climate Control', 'High-Flow O2', 'Suction Unit', '+'],
    startingPrice: 1200,
  },
  {
    id: 'icu',
    name: 'Mobile ICU',
    image: '/images/mobile-icu.png',
    description: 'Ventilator-equipped critical care with a paramedic team.',
    equipment: ['Ventilator', 'Defibrillator', 'Multi-Para Monitor', '+'],
    startingPrice: 3500,
  },
  {
    id: 'ccu',
    name: 'Cardiac CCU',
    image: '/images/cardiac-ccu.png',
    description: 'Cardiac-specialised crew for chest pain and post-op cases.',
    equipment: ['12-Lead ECG', 'Defibrillator', 'Ventilator', '+'],
    startingPrice: 4200,
  },
  {
    id: 'neonatal',
    name: 'Neonatal Transport',
    image: '/images/neonatal-transport.png',
    description: 'Transport incubator and NICU-trained nurse for newborns.',
    equipment: ['Transport Incubator', 'Neonatal Ventilator', 'Warmer', '+'],
    startingPrice: 4800,
  },
  {
    id: 'freezer',
    name: 'Freezer Van',
    image: '/images/freezer-van.png',
    description: 'Refrigerated, dignified mortuary transport.',
    equipment: ['Refrigerated Chamber', 'Sealed Casket Tray', 'Two Bearers'],
    startingPrice: 2500,
  },
];

export const VehicleClassesManifestSection: React.FC = () => {
  return (
    <section className="bg-slate-50/50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Six vehicle classes, matched to the severity you report
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Every class carries its own equipment manifest and crew certification. Pick one at
            booking, or let the dispatcher upgrade you if the case escalates.
          </p>
        </div>

        {/* 6 Vehicle Manifest Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MANIFEST_CLASSES.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Equipment Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <span className="block text-[11px] text-slate-500">From</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      BDT {item.startingPrice.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href="/#booking"
                    className="inline-flex rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    Book Category
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
