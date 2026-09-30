import React from 'react';
import { Metadata } from 'next';
import NotificationCenterView from '@/components/dashboard/NotificationCenter/NotificationCenterView';

export const metadata: Metadata = {
  title: 'Notifications & Emergency Alerts | PulseRoute Patient',
  description: 'Manage real-time dispatch telemetries, trip confirmations, and hospital invoices.',
};

export default function PatientNotificationsPage() {
  return <NotificationCenterView dashboardType="patient" />;
}
