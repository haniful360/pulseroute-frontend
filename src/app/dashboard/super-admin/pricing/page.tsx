import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { DollarSign } from 'lucide-react';

export default function PricingCommissionPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Pricing & Commission Strategy"
        description="Set base ambulance dispatch fares, per-kilometer rates, night surcharges, and operator commissions."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <DollarSign className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Fare Schedule &amp; Commission Matrix</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Dynamic pricing rules: standard base fare 1,200 BDT + 45 BDT/km; ICU surcharge +1,500 BDT.
        </p>
      </div>
    </div>
  );
}
