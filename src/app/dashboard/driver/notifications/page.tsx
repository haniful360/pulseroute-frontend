import React from 'react';
import { Metadata } from 'next';
import NotificationCenterView from '@/components/dashboard/NotificationCenter/NotificationCenterView';

export const metadata: Metadata = {
  title: 'Dispatch Alerts & Notifications | PulseRoute Driver',
  description: 'Manage incoming mission dispatches, payout receipts, and fleet broadcasts.',
};

export default function DriverNotificationsPage() {
  return <NotificationCenterView dashboardType="driver" />;
}
