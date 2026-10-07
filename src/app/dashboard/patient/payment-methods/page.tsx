import { Suspense } from 'react';
import PaymentMethodsView from '@/app/dashboard/patient/payment-methods/_components/PaymentMethods/PaymentMethodsView';
import { PaymentMethodsSkeleton } from '@/components/dashboard/skeletons/patient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Dispatch Checkout & Stripe Payments | PulseRoute',
  description: 'Settle emergency ambulance dispatch invoices securely using Stripe Card payments.',
};

export default function PaymentMethodsPage() {
  return (
    <Suspense fallback={<PaymentMethodsSkeleton />}>
      <PaymentMethodsView />
    </Suspense>
  );
}

