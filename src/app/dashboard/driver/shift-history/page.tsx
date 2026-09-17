import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { History } from 'lucide-react';

export default function ShiftHistoryPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Shift History & Logs"
        description="View past emergency responses, completed duty shifts, and paramedic telemetry records."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <History className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Shift History Recorded</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          All 14 completed shifts this month have an average response time of 6.8 minutes.
        </p>
      </div>
    </div>
  );
}

