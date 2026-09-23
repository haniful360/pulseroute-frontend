import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';

export default function AnnouncementsPage() {
  return (
    <AdminDataView
      title="Fleet Announcements & Emergency Broadcasts"
      description="Broadcast high-priority traffic alerts, weather advisories, and protocol updates to all online drivers."
      stats={[
        { label: 'Online recipients', value: '62', delta: 'Drivers currently online' },
        { label: 'Sent this month', value: '28', delta: '+6 vs August' },
        { label: 'Read rate', value: '94%', delta: 'Across fleet' },
      ]}
      form="announcement"
      actionLabel="New broadcast"
    />
  );
}
