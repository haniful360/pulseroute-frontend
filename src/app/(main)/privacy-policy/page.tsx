import type { Metadata } from 'next';
import PrivacyPage, { metadata as privacyMetadata } from '../privacy/page';

export const metadata: Metadata = {
  ...privacyMetadata,
  alternates: {
    canonical: '/privacy',
  },
};

export default PrivacyPage;
