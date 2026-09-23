import ActiveDispatchView from '@/components/dashboard/driver/ActiveDispatchView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Emergency Dispatch Navigation | PulseRoute',
  description: 'Real-time turn-by-turn navigation and telemetry to patient pickup location.',
};

export default function ActiveDispatchPage() {
  return <ActiveDispatchView />;
}
