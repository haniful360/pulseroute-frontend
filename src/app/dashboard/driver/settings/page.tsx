import DriverSettingsView from '@/app/dashboard/driver/settings/_components/DriverSettingsView/DriverSettingsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Cockpit Settings | PulseRoute',
  description: 'Configure dispatch alert volume, emergency auto-accept preferences, and audio radar tones.',
};

export default function DriverSettingsPage() {
  return <DriverSettingsView />;
}
