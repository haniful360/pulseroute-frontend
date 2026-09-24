import PricingView from '@/app/dashboard/super-admin/pricing/_components/PricingView/PricingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Commission Strategy | PulseRoute',
  description: 'Set base ambulance dispatch fares, per-kilometer rates, night surcharges, and operator commissions.',
};

export default function PricingCommissionPage() {
  return <PricingView />;
}

