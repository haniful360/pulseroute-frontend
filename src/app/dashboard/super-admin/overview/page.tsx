import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { LayoutDashboard } from 'lucide-react';

export default function SuperAdminOverviewPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Executive Overview"
        description="High-level fleet analytics, emergency response KPIs, and platform revenue metrics."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <LayoutDashboard className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Executive Analytics Console</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Real-time metrics: 98.4% dispatch fulfillment rate across 42 active Dhaka hospital nodes.
        </p>
      </div>
    </div>
  );
}
