import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';
import { fleetRows } from '@/components/dashboard/super-admin/adminPageData';

export default function FleetManagementPage() {
  return (
    <AdminDataView
      title="Ambulance Fleet Management"
      description="Manage hospital fleets, private operators, vehicle specifications, and equipment certifications."
      stats={[
        { label: 'Total vehicles', value: '84', delta: '100% tracked' },
        { label: 'ICU units', value: '32', delta: '4 due for audit' },
        { label: 'AC units', value: '28', delta: 'All compliant' },
        { label: 'Maintenance', value: '6', delta: '2 overdue', positive: false },
      ]}
      columns={['Vehicle', 'Operator', 'Type', 'Status']}
      rows={fleetRows}
      filters={['All', 'Online', 'Maintenance']}
      actionLabel="Add vehicle"
      searchPlaceholder="Search vehicle or plate..."
    />
  );
}
