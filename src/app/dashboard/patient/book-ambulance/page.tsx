import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Ambulance } from 'lucide-react';
import Link from 'next/link';

export default function BookAmbulancePage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Book Ambulance"
        description="Request emergency or non-emergency medical transport in real-time."
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <Ambulance className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Immediate Emergency Dispatch</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Fast-track ambulance dispatch with live GPS tracking, nearest certified paramedics, and
          automated hospital pre-arrival alert.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard/patient/medical-profile"
            className="rounded-xl border border-gray-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Review Medical Profile
          </Link>
          <button className="rounded-xl bg-[#E63946] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600">
            Request Ambulance Now
          </button>
        </div>
      </div>
    </div>
  );
}
