import AmbulanceProfileView from '@/app/dashboard/driver/ambulance-profile/_components/AmbulanceProfileView/AmbulanceProfileView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ambulance Profile & Equipment Inventory | PulseRoute',
  description: 'Specifications, life-support inventory, and fitness registration for ambulance units.',
};

export default function AmbulanceProfilePage() {
  return <AmbulanceProfileView />;
}
