import DriverKycView from '@/app/dashboard/driver/kyc/_components/DriverKycView/DriverKycView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KYC & Legal Verification | PulseRoute',
  description: 'View your verified BRTA driving license, Election Commission NID validation, and hospital credentials.',
};

export default function DriverKycPage() {
  return <DriverKycView />;
}
