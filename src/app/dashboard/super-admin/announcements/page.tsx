import AnnouncementsView from '@/app/dashboard/super-admin/announcements/_components/AnnouncementsView/AnnouncementsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet Announcements & Emergency Broadcasts | PulseRoute',
  description: 'Dispatch fleet-wide notifications and emergency advisories.',
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}

