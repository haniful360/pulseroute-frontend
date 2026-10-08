import type { Metadata } from 'next';
import VerifyOtpPage, { metadata as verifyOtpMetadata } from '../verify-otp/page';

export const metadata: Metadata = {
  ...verifyOtpMetadata,
  alternates: {
    canonical: '/verify-otp',
  },
};

export default VerifyOtpPage;
