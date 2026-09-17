import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Radio } from 'lucide-react';

export default function FleetRadarPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Live Fleet Radar"
        description="Dhaka-wide real-time GPS telemetry and active emergency response tracking."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Radio className="h-8 w-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Live Fleet Tracking Active</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Monitoring 84 registered emergency vehicles across Dhaka North and South divisions.
        </p>
      </div>
    </div>
  );
}
