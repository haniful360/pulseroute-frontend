import DriverSettingsView from '@/app/dashboard/driver/settings/_components/DriverSettingsView/DriverSettingsView';
import { Metadata } from 'next';
import { Suspense } from 'react';
import DriverSettingsSkeleton from '@/components/dashboard/skeletons/driver/DriverSettingsSkeleton';

export const metadata: Metadata = {
  title: 'Driver Profile & Cockpit Settings | PulseRoute',
  description: 'Manage driver personal credentials, vehicle fleet specifications, life-support equipment, and radar automation.',
};

export default function DriverSettingsPage() {
  return (
    <Suspense fallback={<DriverSettingsSkeleton />}>
      <DriverSettingsView />
    </Suspense>
  );
}
