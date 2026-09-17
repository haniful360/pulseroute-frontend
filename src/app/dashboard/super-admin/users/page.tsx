import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Users } from 'lucide-react';

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="User & Paramedic Management"
        description="Oversee paramedic roster, hospital dispatch coordinators, and patient account permissions."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <Users className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">User Access Directory</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Manage roles for Paramedics, Hospital Triage Officers, System Admins, and Support Staff.
        </p>
      </div>
    </div>
  );
}
