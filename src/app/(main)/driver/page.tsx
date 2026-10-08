import type { Metadata } from 'next';
import JoinDriverPage, { metadata as joinDriverMetadata } from '../join-driver/page';

export const metadata: Metadata = {
  ...joinDriverMetadata,
  alternates: {
    canonical: '/join-driver',
  },
};

export default JoinDriverPage;
