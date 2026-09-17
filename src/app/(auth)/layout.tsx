import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'PulseRoute Authentication & Onboarding',
  description:
    'Sign in to access your PulseRoute portal or register as a patient or certified paramedic driver.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      {children}
    </div>
  );
}
