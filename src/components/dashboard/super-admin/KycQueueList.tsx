'use client';

import { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { Applicant, QueueStatus } from './types';
import { cn } from '@/lib/utils';

interface KycQueueListProps {
  applicants: Applicant[];
  selectedApplicantId: string;
  onSelectApplicant: (id: string) => void;
}

export default function KycQueueList({
  applicants,
  selectedApplicantId,
  onSelectApplicant,
}: KycQueueListProps) {
  const [activeTab, setActiveTab] = useState<QueueStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplicants = applicants.filter((app) => {
    const matchesTab = app.statusCategory === activeTab;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Queue Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Verification Queue
        </h2>

        {/* Tab Filters */}
        <div className="mt-4 flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('Pending')}
            className={cn(
              'flex-1 cursor-pointer rounded-xl py-2 text-xs font-bold transition-all text-center',
              activeTab === 'Pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            Pending (42)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Approved')}
            className={cn(
              'flex-1 cursor-pointer rounded-xl py-2 text-xs font-bold transition-all text-center',
              activeTab === 'Approved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Rejected')}
            className={cn(
              'flex-1 cursor-pointer rounded-xl py-2 text-xs font-bold transition-all text-center',
              activeTab === 'Rejected'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            Rejected
          </button>
        </div>

        {/* Search inside queue */}
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-3 pl-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Queue Applicant List */}
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[640px]">
        {filteredApplicants.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No applicants in this category.
          </div>
        ) : (
          filteredApplicants.map((applicant) => {
            const isSelected = applicant.id === selectedApplicantId;
            const isUrgent = applicant.urgency === 'Urgent';

            return (
              <button
                key={applicant.id}
                type="button"
                onClick={() => onSelectApplicant(applicant.id)}
                className={cn(
                  'w-full cursor-pointer p-4 text-left transition-all border-l-4',
                  isSelected
                    ? 'border-[#E63946] bg-red-50/30'
                    : 'border-transparent hover:bg-slate-50/70',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-sm">
                    {applicant.name}
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      isUrgent
                        ? 'bg-[#FEF2F2] text-[#E63946] border border-red-200'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {applicant.urgency}
                  </span>
                </div>

                <div className="mt-1 text-xs font-semibold text-slate-600">
                  {applicant.vehicleType}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {applicant.submittedAt}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    ID: {applicant.id}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
