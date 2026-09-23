import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';
import { tripRows } from '@/components/dashboard/super-admin/adminPageData';

export default function SuperAdminOverviewPage() {
  return (
    <AdminDataView
      title="Executive Overview"
      description="High-level fleet analytics, emergency response KPIs, and platform revenue metrics."
      stats={[
        { label: 'Dispatch fulfillment', value: '98.4%', delta: '+4.8% this month' },
        { label: 'Active fleet', value: '84', delta: '12 responding now' },
        { label: 'Monthly GMV', value: '4.82M', delta: '+18.2% vs August' },
        { label: 'Avg. response', value: '8m 42s', delta: '-14% faster', positive: true },
      ]}
      columns={['Patient', 'Driver', 'Route', 'Status']}
      rows={tripRows}
      filters={['All', 'Completed', 'Critical']}
      searchPlaceholder="Search dispatches..."
    />
  );
}
