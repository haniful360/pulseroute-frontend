import TrafficOptView from '@/app/dashboard/driver/traffic-opt/_components/TrafficOptView/TrafficOptView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Traffic Optimization & Green Corridors | PulseRoute',
  description: 'Predictive green-corridor ambulance route guidance powered by real-time Dhaka traffic cameras.',
};

export default function TrafficOptPage() {
  return <TrafficOptView />;
}
