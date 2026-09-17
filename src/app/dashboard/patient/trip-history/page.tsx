import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { HeartPulse } from 'lucide-react';

export default function TripHistoryPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Trip History"
        description="View records and paramedic summaries of your previous emergency and scheduled trips."
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-[#E63946]">
          <HeartPulse className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Trip Records</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Your emergency dispatch history, hospital drop-off records, and invoices are securely
          stored here.
        </p>
      </div>
    </div>
  );
}
