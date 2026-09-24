import BookAmbulanceView from '@/app/dashboard/patient/book-ambulance/_components/BookAmbulanceView/BookAmbulanceView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Emergency Ambulance Cockpit | PulseRoute',
  description: 'Instant ICU, CCU, and AC emergency ambulance dispatch booking in Dhaka.',
};

export default function BookAmbulancePage() {
  return <BookAmbulanceView />;
}
