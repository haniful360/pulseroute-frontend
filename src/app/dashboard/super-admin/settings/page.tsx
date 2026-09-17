import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Settings } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Super Admin System Settings"
        description="Configure Election Commission API keys, BRTA validation webhook endpoints, and security audits."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">System Configuration</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Election Commission database sync frequency: every 15 minutes. Two-factor authentication enforced.
        </p>
      </div>
    </div>
  );
}
