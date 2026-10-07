'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, PhoneCall } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected page error for telemetry
    console.error('Unhandled Application Crash:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl text-center space-y-6">
        {/* Warning Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#e63946] border border-red-100 shadow-xs">
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Title and Explanation */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e63946]">
            SYSTEM NOTICE • PULSEROUTE
          </div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            An unexpected error occurred while rendering this view. Our emergency dispatch operations remain active.
          </p>
        </div>

        {/* Error Digest (if provided) */}
        {error?.digest && (
          <div className="rounded-xl bg-slate-50 p-3 text-xs font-mono text-slate-400 border border-slate-100">
            Error ID: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#e63946] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>

        {/* Emergency Hotline Hotline Notice */}
        <div className="border-t border-slate-100 pt-5 text-xs text-slate-400 flex items-center justify-center gap-2">
          <PhoneCall className="h-3.5 w-3.5 text-[#e63946]" />
          <span>For urgent medical dispatch assistance, call hotline <strong>999</strong></span>
        </div>
      </div>
    </div>
  );
}
