import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Navigation } from 'lucide-react';

export default function ActiveDispatchPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Active Dispatch"
        description="Monitor real-time patient emergency dispatch, navigation route, and hospital ETA."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <Navigation className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Active Dispatch Mission #DISP-9102</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          En route to Dhanmondi 27 for critical ICU transport. Hospital triage node: Square Hospital.
        </p>
      </div>
    </div>
  );
}

