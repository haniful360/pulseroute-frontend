import ShiftHistoryView from '@/components/dashboard/driver/ShiftHistoryView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shift History & Emergency Telemetry | PulseRoute',
  description: 'View past emergency responses, completed duty shifts, and paramedic telemetry records.',
};

export default function ShiftHistoryPage() {
  return <ShiftHistoryView />;
}
