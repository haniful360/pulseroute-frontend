import type { Metadata } from 'next';
import RefundPage, { metadata as refundMetadata } from '../refund/page';

export const metadata: Metadata = {
  ...refundMetadata,
  alternates: {
    canonical: '/refund',
  },
};

export default RefundPage;
