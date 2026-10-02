import PatientOverviewView from '@/app/dashboard/patient/_components/PatientOverview/PatientOverviewView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Emergency Cockpit | PulseRoute',
  description: 'Real-time emergency ambulance dispatch, active trip telemetry, and medical SOS cockpit.',
};

export default function PatientDashboardPage() {
  return <PatientOverviewView />;
}
