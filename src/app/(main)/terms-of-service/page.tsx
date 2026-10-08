import type { Metadata } from 'next';
import TermsPage, { metadata as termsMetadata } from '../terms/page';

export const metadata: Metadata = {
  ...termsMetadata,
  alternates: {
    canonical: '/terms',
  },
};

export default TermsPage;
