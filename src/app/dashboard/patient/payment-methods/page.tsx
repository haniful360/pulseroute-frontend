import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { CreditCard } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Payment Methods & Insurance"
        description="Manage saved payment cards, mobile banking, and health insurance plans."
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CreditCard className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Secure Payment Options</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Link your bKash, Nagad, Credit Card, or health insurance coverage for seamless
          zero-friction dispatch payments.
        </p>
      </div>
    </div>
  );
}
