import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Route } from 'lucide-react';

export default function TripManagementPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Trip Management & Dispatch Logs"
        description="Search, filter, and audit ongoing and past emergency dispatches and patient transfers."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Route className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Trip Audit Master Log</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Over 1,240 emergency trips logged with full GPS waypoint telemetry and patient handover timestamps.
        </p>
      </div>
    </div>
  );
}

