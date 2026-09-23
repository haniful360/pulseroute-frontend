import DriverSettingsView from '@/components/dashboard/driver/DriverSettingsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Cockpit Settings | PulseRoute',
  description: 'Configure dispatch alert volume, emergency auto-accept preferences, and audio radar tones.',
};

export default function DriverSettingsPage() {
  return <DriverSettingsView />;
}
