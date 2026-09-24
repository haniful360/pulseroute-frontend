import WardStatusView from '@/app/dashboard/driver/ward-status/_components/WardStatusView/WardStatusView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospital Ward & ER Bed Telemetry | PulseRoute',
  description: 'Live availability of ICU, CCU, NICU beds and emergency room triage capacity in Dhaka hospitals.',
};

export default function WardStatusPage() {
  return <WardStatusView />;
}
