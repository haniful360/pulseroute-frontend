import { ArrowRight, Info } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface VehicleCardData {
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  price: string;
  hasInfo?: boolean;
}

const VEHICLES: VehicleCardData[] = [
  {
    title: 'Basic Life Support',
    description: 'Non-critical transfers with a trained attendant on board.',
    imageSrc: '/images/basic-life-support.png',
    tags: ['Oxygen Cylinder', 'Stretcher', 'First-Aid Kit', '+'],
    price: 'BDT 900',
  },
  {
    title: 'AC Patient Transport',
    description: 'Climate-controlled cabin for longer inter-city transfers.',
    imageSrc: '/images/ac-patient-transport.png',
    tags: ['Climate Control', 'High-Flow O2', 'Suction Unit', '+'],
    price: 'BDT 1,200',
  },
  {
    title: 'Mobile ICU',
    description: 'Ventilator-equipped critical care with a paramedic team.',
    imageSrc: '/images/mobile-icu.png',
    tags: ['Ventilator', 'Defibrillator', 'Multi-Para Monitor', '+'],
    price: 'BDT 3,500',
  },
  {
    title: 'Cardiac CCU',
    description: 'Cardiac-specialised crew for chest pain and post-op cases.',
    imageSrc: '/images/cardiac-ccu.png',
    tags: ['12-Lead ECG', 'Defibrillator', 'Ventilator', '+'],
    price: 'BDT 4,200',
  },
  {
    title: 'Neonatal Transport',
    description: 'Transport incubator and NICU-trained nurse for newborns.',
    imageSrc: '/images/neonatal-transport.png',
    tags: ['Transport Incubator', 'Neonatal Ventilator', 'Warmer', '+'],
    price: 'BDT 4,800',
  },
  {
    title: 'Freezer Van',
    description: 'Refrigerated, dignified mortuary transport.',
    imageSrc: '/images/freezer-van.png',
    tags: ['Refrigerated Chamber', 'Sealed Casket Tray', 'Two Bearers'],
    price: 'BDT 2,500',
    hasInfo: true,
  },
];

export const VehicleClassesSection: React.FC = () => {
  return (
    <section id="vehicles" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl sm:mb-16">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Six vehicle classes, matched to the severity you report
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
            Every class carries its own equipment manifest and crew certification. Pick one at
            booking, or let the dispatcher upgrade you if the case escalates.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {VEHICLES.map((vehicle, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image Banner */}
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:h-52">
                <Image
                  src={vehicle.imageSrc}
                  alt={vehicle.title}
                  width={340}
                  height={190}
                  className="max-h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{vehicle.title}</h3>
                    {vehicle.hasInfo && (
                      <span title="Dignified, specialized mortuary transport services">
                        <Info className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600" />
                      </span>
                    )}
                  </div>

                  <p className="mb-4 min-h-[40px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {vehicle.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {vehicle.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-block rounded-md border border-slate-200/60 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <span className="block text-[11px] text-slate-500">From</span>
                    <span className="text-sm font-extrabold text-slate-900 sm:text-base">
                      {vehicle.price}
                    </span>
                  </div>

                  <a
                    href="#booking"
                    className="group/btn inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-sm transition-all hover:bg-red-600 hover:text-white"
                  >
                    <span>Book Category</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleClassesSection;
