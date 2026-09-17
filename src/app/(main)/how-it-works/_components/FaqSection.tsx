'use client';

import { Input } from '@/components/ui/input';
import { Minus, Plus, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    title: 'Booking',
    items: [
      {
        id: 'booking-1',
        question: 'How fast is an ambulance actually dispatched?',
        answer:
          'A request enters the dispatch queue the moment you tap Find Nearest Ambulance. The nearest qualifying crew accepts within an average of 22 seconds, and median on-scene arrival across our covered cities is under 7 minutes.',
      },
      {
        id: 'booking-2',
        question: 'Can I book an ambulance for a scheduled hospital transfer?',
        answer:
          'Yes. You can schedule inter-hospital transfers or clinic pickups up to 72 hours in advance. Scheduled bookings guarantee an assigned vehicle 30 minutes before your requested departure time.',
      },
      {
        id: 'booking-3',
        question: 'What if no ambulance is available near me?',
        answer:
          'If no qualifying ambulance is immediately in range, our dispatch command center automatically escalates the search radius and notifies regional emergency backup partners within 60 seconds.',
      },
    ],
  },
  {
    title: 'Payment',
    items: [
      {
        id: 'payment-1',
        question: 'Is the fare I see at booking the fare I pay?',
        answer:
          'Yes, 100%. The fare range shown at booking is locked at dispatch. Drivers are legally and contractually bound not to demand roadside cash negotiations or extra fees.',
      },
      {
        id: 'payment-2',
        question: 'Do I need to pay before the ambulance arrives?',
        answer:
          'No. A pre-authorization hold is placed on your digital card or mobile wallet at dispatch. The actual charge is settled only after the patient is safely transferred to the destination hospital.',
      },
      {
        id: 'payment-3',
        question: 'Can I claim the trip on insurance?',
        answer:
          'Yes. Every completed trip issues an official GST/tax-compliant digital invoice with GPS telemetry logs, crew credentials, and hospital timestamp for easy health insurance reimbursement.',
      },
    ],
  },
  {
    title: 'Driver Matching',
    items: [
      {
        id: 'matching-1',
        question: 'How is a crew matched to my request?',
        answer:
          'Our dispatch engine calculates live ETA, traffic conditions, vehicle equipment class, and crew medical certifications to match the optimal crew within a 20-second offer cycle.',
      },
      {
        id: 'matching-2',
        question: 'Can I request a specific hospital the crew is not familiar with?',
        answer:
          'Yes. You can select any licensed hospital or clinic in Bangladesh. The driver app includes turn-by-turn routing directly to the emergency entrance of your chosen facility.',
      },
    ],
  },
  {
    title: 'Safety',
    items: [
      {
        id: 'safety-1',
        question: 'Are paramedics verified?',
        answer:
          'Every paramedic on critical-care ambulances is NID-verified, holds valid BLS (Basic Life Support) or ACLS (Advanced Cardiac Life Support) certification, and undergoes annual background checks.',
      },
      {
        id: 'safety-2',
        question: 'How are vehicles sanitised between trips?',
        answer:
          'Every vehicle undergoes medical-grade disinfection between patient handovers, followed by deep sanitisation at the end of each shift, verified digitally in the driver app.',
      },
    ],
  },
];

export const FaqSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // First item open by default matching Figma design
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'booking-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter items by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const query = searchQuery.toLowerCase();

    return FAQ_DATA.map((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
      );
      return {
        ...category,
        items: matchingItems,
      };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery]);

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 max-w-3xl sm:mb-10">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Search, or browse by category.</p>
        </div>

        {/* Search Bar matching Figma */}
        <div className="mb-12 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions — fare, insurance, sanitisation…"
              className="h-11 rounded-xl border-slate-200/90 bg-white pl-10 text-sm shadow-xs focus:bg-white"
            />
          </div>
        </div>

        {/* Categories and Accordions */}
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              {/* Category Label */}
              <h3 className="pl-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                {category.title}
              </h3>

              {/* Accordion Group */}
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                {category.items.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div key={item.id} className="transition-colors">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/70 sm:p-6"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-4 text-sm leading-snug font-semibold text-slate-900 sm:text-base">
                          {item.question}
                        </span>
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-transform">
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="animate-in fade-in-50 px-5 pt-0 pb-5 text-xs leading-relaxed text-slate-600 duration-200 sm:px-6 sm:pb-6 sm:text-sm">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No questions found</p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching with different keywords like fare, paramedics, or booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
