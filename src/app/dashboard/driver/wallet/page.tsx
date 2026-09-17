import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Wallet } from 'lucide-react';

export default function DriverWalletPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Stripe Wallet & Earnings"
        description="Manage your emergency dispatch payouts, connected Stripe account, and instant withdrawals."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#06D6A0]">
          <Wallet className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Available Balance: 12,450.00 BDT</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Connected to Stripe Connect account (acct_paramedic_dh102). Payouts clear in under 2 hours.
        </p>
      </div>
    </div>
  );
}

