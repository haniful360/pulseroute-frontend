import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';
import { userRows } from '@/components/dashboard/super-admin/adminPageData';

export default function UserManagementPage() {
  return (
    <AdminDataView
      title="User & Paramedic Management"
      description="Oversee paramedic roster, hospital dispatch coordinators, and patient account permissions."
      stats={[
        { label: 'Total users', value: '2,486', delta: '+124 this month' },
        { label: 'Paramedics', value: '318', delta: '284 active' },
        { label: 'Triage desks', value: '42', delta: 'Across 18 hospitals' },
        { label: 'Pending KYC', value: '42', delta: 'Needs review', positive: false },
      ]}
      columns={['Name', 'Role', 'Region', 'Status']}
      rows={userRows}
      filters={['All', 'Active', 'Suspended']}
      actionLabel="Invite user"
      searchPlaceholder="Search name or role..."
    />
  );
}
