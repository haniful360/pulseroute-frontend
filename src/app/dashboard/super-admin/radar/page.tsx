import RadarView from '@/app/dashboard/super-admin/radar/_components/RadarView/RadarView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Fleet Radar | PulseRoute',
  description: 'Dhaka-wide real-time GPS telemetry and active emergency response tracking.',
};

export default function FleetRadarPage() {
  return <RadarView />;
}

