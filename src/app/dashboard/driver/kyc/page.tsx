import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { ShieldCheck } from 'lucide-react';

export default function DriverKycPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="KYC & Legal Verification"
        description="View your verified BRTA driving license, Election Commission NID validation, and hospital credentials."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Verification Status: Verified &amp; Active
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Driver ID: PR-DRV-9022. All documents validated by Super Admin Rahat Mahmud on 12 Oct
          2023.
        </p>
      </div>
    </div>
  );
}
