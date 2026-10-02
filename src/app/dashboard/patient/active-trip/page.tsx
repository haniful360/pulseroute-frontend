import { Suspense } from 'react';
import ActiveTripView from '@/app/dashboard/patient/active-trip/_components/ActiveTripView/ActiveTripView';
import { ActiveTripSkeleton } from '@/components/dashboard/skeletons/patient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Emergency Trip & Paramedic Live Tracking | PulseRoute',
  description: 'Track your incoming emergency ambulance in real time with live telemetry and driver chat.',
};

export default function ActiveTripPage() {
  return (
    <Suspense fallback={<ActiveTripSkeleton />}>
      <ActiveTripView />
    </Suspense>
  );
}
