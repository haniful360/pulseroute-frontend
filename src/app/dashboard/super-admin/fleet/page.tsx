import FleetView from '@/app/dashboard/super-admin/fleet/_components/FleetView/FleetView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ambulance Fleet Management | PulseRoute',
  description: 'Monitor, dispatch, and manage ambulance availability and maintenance schedules.',
};

export default function FleetManagementPage() {
  return <FleetView />;
}

