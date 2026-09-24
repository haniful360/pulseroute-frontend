import UsersView from '@/app/dashboard/super-admin/users/_components/UsersView/UsersView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User & Paramedic Management | PulseRoute',
  description: 'Manage roles, view statuses, and track personnel across regions.',
};

export default function UserManagementPage() {
  return <UsersView />;
}

