import ActiveTripView from '@/app/dashboard/patient/active-trip/_components/ActiveTripView/ActiveTripView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Emergency Trip & Paramedic Live Tracking | PulseRoute',
  description: 'Track your incoming emergency ambulance in real time with live telemetry and driver chat.',
};

export default function ActiveTripPage() {
  return <ActiveTripView />;
}
