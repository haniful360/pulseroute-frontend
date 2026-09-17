'use client';

import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Emergency Hotline"
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-red-400/40 bg-red-600/95 px-5 py-2.5 text-xs font-semibold text-white shadow-xl shadow-red-600/30 backdrop-blur-md transition-all duration-300 hover:bg-red-600 sm:text-sm"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
        </span>
        <Phone className="h-4 w-4 fill-white" />
        <span>EMERGENCY?</span>
      </div>

      <a
        href="tel:999"
        className="font-bold tracking-wide underline underline-offset-2 transition-colors hover:text-red-100"
      >
        Call 999 Now
      </a>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 rounded-full p-0.5 text-white/80 transition-colors hover:bg-red-700/60 hover:text-white"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
};
