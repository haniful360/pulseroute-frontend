import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Settings } from 'lucide-react';

export default function PatientSettingsPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Settings & Privacy"
        description="Configure account preferences, notifications, and emergency broadcast access."
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Account & Privacy Settings</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Manage your personal information, notification preferences, two-factor authentication, and
          SOS privacy rules.
        </p>
      </div>
    </div>
  );
}
