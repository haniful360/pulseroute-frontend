import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';
import { tripRows } from '@/components/dashboard/super-admin/adminPageData';

export default function TripManagementPage() {
  return (
    <AdminDataView
      title="Trip Management & Dispatch Logs"
      description="Search, filter, and audit ongoing and past emergency dispatches and patient transfers."
      stats={[
        { label: 'Total trips', value: '1,240', delta: '+86 this month' },
        { label: 'In progress', value: '18', delta: '3 critical' },
        { label: 'Completed today', value: '142', delta: '+11.4%' },
        { label: 'Cancelled', value: '8', delta: '-2.1%', positive: true },
      ]}
      columns={['Patient', 'Driver', 'Route', 'Status']}
      rows={tripRows}
      filters={['All', 'Completed', 'Critical', 'In Transit']}
      searchPlaceholder="Search trip ID, patient..."
    />
  );
}
