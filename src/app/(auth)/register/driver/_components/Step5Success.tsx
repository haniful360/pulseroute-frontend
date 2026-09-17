'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  FileCheck,
  Stethoscope,
  ShieldAlert,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface Step5Props {
  trackingId?: string;
}

export const Step5Success: React.FC<Step5Props> = ({ trackingId = 'PR-92834-DRV' }) => {
  return (
    <div className="mx-auto max-w-lg space-y-8 py-2">
      {/* Celebration Checkmark Badge */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-500/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 animate-bounce text-emerald-500">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Application Submitted Successfully!
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed font-normal text-slate-500 sm:text-sm">
          Our team will review your documents within 24–48 hours. You will receive a notification
          once approved.
        </p>
      </div>

      {/* Dark Status Banner (Matches Figma 9:1116) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/80 text-red-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Application Under Review</h4>
              <p className="mt-0.5 font-mono text-xs text-slate-400">
                Tracking ID: <span className="font-semibold text-slate-200">{trackingId}</span>
              </p>
            </div>
          </div>

          <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-sm">
            In Queue
          </span>
        </div>
      </div>

      {/* Verification Progress Checklist */}
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6">
        <h4 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
          Verification Progress
        </h4>

        <div className="space-y-3">
          {/* 1. Driving License Verification */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Driving License Verification</p>
                <p className="text-[11px] text-slate-400">Document authenticity check</p>
              </div>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700">
              PENDING
            </span>
          </div>

          {/* 2. Ambulance Equipment Check */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Ambulance Equipment Check</p>
                <p className="text-[11px] text-slate-400">Medical gear standards review</p>
              </div>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700">
              PENDING
            </span>
          </div>

          {/* 3. Background Verification */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Background Verification</p>
                <p className="text-[11px] text-slate-400">Police clearance & records</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-blue-700">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>IN PROGRESS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href="/dashboard"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-slate-800"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="text-center">
          <Link
            href="/contact"
            className="text-xs font-bold text-red-600 transition-colors hover:text-red-700"
          >
            Contact Support for Assistance
          </Link>
        </div>
      </div>
    </div>
  );
};
