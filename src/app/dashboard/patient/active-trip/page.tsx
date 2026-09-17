import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export default function ActiveTripPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Active Trip & Live GPS"
        description="Monitor ongoing ambulance dispatch and estimated arrival time."
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Active Trips Right Now</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          When an ambulance is dispatched for you or your family, its live position, route, and
          paramedic telemetry will appear here.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard/patient/book-ambulance"
            className="rounded-xl bg-[#E63946] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600"
          >
            Dispatch Ambulance
          </Link>
        </div>
      </div>
    </div>
  );
}
