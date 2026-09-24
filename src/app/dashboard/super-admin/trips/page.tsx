import TripsView from '@/app/dashboard/super-admin/trips/_components/TripsView/TripsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trip Management & Dispatch Logs | PulseRoute',
  description: 'Search, filter, and audit ongoing and past emergency dispatches and patient transfers.',
};

export default function TripManagementPage() {
  return <TripsView />;
}

