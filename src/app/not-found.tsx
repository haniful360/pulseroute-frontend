import React from 'react';
import Link from 'next/link';
import { Ambulance, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6">
        {/* Animated Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-[#e63946] border border-red-100 shadow-xs">
          <Ambulance className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-mono">
            404
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Route Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            The emergency dispatch page or medical record you requested could not be located. It might have been moved or archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#e63946] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
