import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';

export default function FleetRadarPage() {
  return (
    <AdminDataView
      title="Live Fleet Radar"
      description="Dhaka-wide real-time GPS telemetry and active emergency response tracking."
      stats={[
        { label: 'Registered fleet', value: '84', delta: '4 added this week' },
        { label: 'Online now', value: '62', delta: '74% availability' },
        { label: 'On dispatch', value: '12', delta: '3 critical trips' },
        { label: 'Offline', value: '10', delta: '2 maintenance', positive: false },
      ]}
      map
    />
  );
}
