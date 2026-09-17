import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Ambulance } from 'lucide-react';

export default function FleetManagementPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Ambulance Fleet Management"
        description="Manage hospital fleets, private operators, vehicle specifications, and equipment certifications."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <Ambulance className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Fleet Inventory & Compliance</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Total active vehicles: 84 (32 ICU units, 28 AC units, 24 Basic Life Support units).
        </p>
      </div>
    </div>
  );
}
