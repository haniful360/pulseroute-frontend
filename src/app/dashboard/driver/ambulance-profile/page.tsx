import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Truck } from 'lucide-react';

export default function AmbulanceProfilePage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Ambulance Profile & Equipment"
        description="Specifications, equipment inventory, and vehicle registration for unit DHA-129."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <Truck className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">ICU Ambulance DHA-129</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Equipped with advanced ventilator, multipara cardiac monitor, and emergency defibrillator.
        </p>
      </div>
    </div>
  );
}

