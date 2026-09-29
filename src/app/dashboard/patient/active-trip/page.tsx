import { Suspense } from 'react';
import ActiveTripView from '@/app/dashboard/patient/active-trip/_components/ActiveTripView/ActiveTripView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Emergency Trip & Paramedic Live Tracking | PulseRoute',
  description: 'Track your incoming emergency ambulance in real time with live telemetry and driver chat.',
};

export default function ActiveTripPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <ActiveTripView />
    </Suspense>
  );
}
