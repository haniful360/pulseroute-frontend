import MedicalProfileView from '@/components/dashboard/patient/MedicalProfileView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Profile & SOS Settings | PulseRoute',
  description: 'Manage your vital medical information and emergency SOS settings on PulseRoute.',
};

export default function PatientDashboardPage() {
  return <MedicalProfileView />;
}
