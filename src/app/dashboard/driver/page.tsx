import DriverCockpitView from '@/components/dashboard/driver/DriverCockpitView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Duty Radar & Cockpit | PulseRoute',
  description: 'Real-time emergency radar and high-demand zones in Dhaka Central.',
};

export default function DriverDashboardPage() {
  return <DriverCockpitView />;
}
