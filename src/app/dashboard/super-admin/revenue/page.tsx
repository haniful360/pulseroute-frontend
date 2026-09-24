import RevenueView from '@/app/dashboard/super-admin/revenue/_components/RevenueView/RevenueView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue Operations & Payouts | PulseRoute',
  description: 'Consolidated transaction logs, platform fee settlements, and automated Stripe payout schedules.',
};

export default function RevenueOpsPage() {
  return <RevenueView />;
}

