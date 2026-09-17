import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { BarChart3 } from 'lucide-react';

export default function RevenueOpsPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Revenue Operations & Payouts"
        description="Consolidated transaction logs, platform fee settlements, and automated Stripe payout schedules."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <BarChart3 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Revenue Ledger</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Monthly gross booking value: 4,820,000 BDT with automated split payouts to private operators.
        </p>
      </div>
    </div>
  );
}

