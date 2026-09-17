import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Building2 } from 'lucide-react';

export default function WardStatusPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Hospital Ward & ER Bed Status"
        description="Live availability of ICU, CCU, NICU beds and emergency room triage capacity in Dhaka hospitals."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Building2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Hospital Ward Status (Coming Soon)</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Direct API telemetry connecting Square Hospital, United Hospital, Evercare, and Dhaka Medical College ER.
        </p>
      </div>
    </div>
  );
}
