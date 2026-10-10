import PayoutsView from '@/app/dashboard/super-admin/payouts/_components/PayoutsView/PayoutsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Payout Management | PulseRoute Super Admin',
  description: 'Manage driver payout withdrawal requests, verify bank & Stripe credentials, and approve or reject disbursements.',
};

export default function DriverPayoutsPage() {
  return <PayoutsView />;
}
