import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Fleet Announcements & Emergency Broadcasts"
        description="Broadcast high-priority traffic alerts, weather advisories, and protocol updates to all online drivers."
      />
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
          <Megaphone className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Broadcast Network Ready</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Send push notifications and audio alerts directly into paramedic duty cockpits across
          Dhaka.
        </p>
      </div>
    </div>
  );
}
