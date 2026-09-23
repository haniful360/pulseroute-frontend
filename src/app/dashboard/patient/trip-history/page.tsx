import TripHistoryView from '@/components/dashboard/patient/TripHistoryView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Trip History & Invoices | PulseRoute',
  description: 'View previous emergency trips, paramedic telemetry summaries, and download receipts.',
};

export default function TripHistoryPage() {
  return <TripHistoryView />;
}
