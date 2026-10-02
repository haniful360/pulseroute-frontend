import PatientSettingsView from '@/app/dashboard/patient/settings/_components/PatientSetting/PatientSettingsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Account Settings & SOS Privacy | PulseRoute',
  description: 'Manage personal profile, SMS emergency broadcasting, and 2FA security settings.',
};

export default function PatientSettingsPage() {
  return <PatientSettingsView />;
}
