import SuperAdminKycView from '@/components/dashboard/super-admin/SuperAdminKycView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver (KYC) Verification Queue & Audit Trail | PulseRoute',
  description:
    'Review Bangladesh Road Transport Authority (BRTA) driving licenses, NID credentials, and emergency ambulance fleet compliance.',
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminKycView />;
}
