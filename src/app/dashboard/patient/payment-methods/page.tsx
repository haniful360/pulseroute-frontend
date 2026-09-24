import PaymentMethodsView from '@/app/dashboard/patient/payment-methods/_components/PaymentMethods/PaymentMethodsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Methods & Emergency Dispatch Checkout | PulseRoute',
  description: 'Manage saved payment cards, bKash wallet authorization, and health insurance billing.',
};

export default function PaymentMethodsPage() {
  return <PaymentMethodsView />;
}
