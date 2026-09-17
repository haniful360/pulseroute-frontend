'use client';

import { useState } from 'react';
import { MessageSquareText, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Applicant } from './types';

interface KycAuditTimelineProps {
  applicant: Applicant;
}

export default function KycAuditTimeline({ applicant }: KycAuditTimelineProps) {
  const [internalNote, setInternalNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  const handleSaveNote = () => {
    if (!internalNote.trim()) {
      toast.error('Please enter a note before saving.');
      return;
    }
    setSavedNotes((prev) => [...prev, internalNote.trim()]);
    setInternalNote('');
    toast.success('Internal reviewer note saved to audit trail.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Application Timeline & Audit Trail Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold tracking-tight text-slate-900">
            Application Timeline &amp; Audit Trail
          </h2>
        </div>

        {/* Timeline Steps */}
        <div className="mt-5 relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-slate-200">
          {applicant.timeline.map((step, index) => {
            return (
              <div key={index} className="relative group">
                {/* Node icon dot */}
                <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-slate-100">
                  {step.status === 'SUCCESS' ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  ) : step.status === 'IN_PROGRESS' ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E63946] animate-pulse" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {step.title}
                      </span>
                      {step.status === 'SUCCESS' && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                          SUCCESS
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {step.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Reviewer's Internal Note Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-[#E63946]" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              Reviewer&apos;s Internal Note (Optional)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Add comments visible only to other admins and supervisor audit logs.
          </p>
        </div>

        {/* Saved Notes Display */}
        {savedNotes.length > 0 && (
          <div className="mt-3 space-y-2">
            {savedNotes.map((note, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 pb-1">
                  <span>Rahat Mahmud (Super Admin)</span>
                  <span>Just now</span>
                </div>
                <p>{note}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <textarea
            rows={3}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Add comments visible only to other admins..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNote}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#0B132B] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-95"
            >
              <Save className="h-3.5 w-3.5 text-slate-300" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
