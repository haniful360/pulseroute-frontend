'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, LayoutDashboard, HelpCircle } from 'lucide-react';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#e63946] border border-red-100 shadow-xs">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e63946]">
            DASHBOARD ERROR
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Failed to load dashboard module
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            We encountered a problem loading this dashboard section. You can retry or return to your main dashboard overview.
          </p>
        </div>

        {error?.digest && (
          <div className="rounded-xl bg-slate-50 p-2.5 text-xs font-mono text-slate-400 border border-slate-100">
            Reference Code: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#e63946] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Section</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard Home</span>
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>If this persists, please contact your dispatcher or fleet support</span>
        </div>
      </div>
    </div>
  );
}
