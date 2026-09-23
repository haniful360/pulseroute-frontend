import AdminDataView from '@/components/dashboard/super-admin/AdminDataView';
import { revenueRows } from '@/components/dashboard/super-admin/adminPageData';

export default function RevenueOpsPage() {
  return (
    <AdminDataView
      title="Revenue Operations & Payouts"
      description="Consolidated transaction logs, platform fee settlements, and automated Stripe payout schedules."
      stats={[
        { label: 'Gross booking value', value: 'BDT 4.82M', delta: '+18.2% this month' },
        { label: 'Platform revenue', value: 'BDT 579K', delta: '12% commission' },
        { label: 'Pending payouts', value: 'BDT 184K', delta: '32 operators' },
        { label: 'Refunds', value: 'BDT 18.4K', delta: '-6.8% vs August', positive: true },
      ]}
      columns={['Date', 'Trip', 'Gross', 'Commission', 'Status']}
      rows={revenueRows}
      filters={['All', 'Settled', 'Pending']}
      searchPlaceholder="Search invoice or trip..."
    />
  );
}
