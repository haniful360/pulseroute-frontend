import OverviewView from '@/app/dashboard/super-admin/overview/_components/OverviewView/OverviewView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Executive Overview | PulseRoute',
  description: 'Real-time analytics and KPI monitoring for the active fleet.',
};

export default function SuperAdminOverviewPage() {
  return <OverviewView />;
}

