import DriverWalletView from '@/components/dashboard/driver/DriverWalletView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paramedic Earnings & Wallet | PulseRoute',
  description: 'Manage your earnings, review trip settlements, and request bank payouts.',
};

export default function DriverWalletPage() {
  return <DriverWalletView />;
}
