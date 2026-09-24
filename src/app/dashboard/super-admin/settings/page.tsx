import SettingsView from '@/app/dashboard/super-admin/settings/_components/SettingsView/SettingsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Admin System Settings | PulseRoute',
  description: 'Configure validation webhook endpoints, security controls, and platform operations preferences.',
};

export default function SuperAdminSettingsPage() {
  return <SettingsView />;
}

