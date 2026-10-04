export type QueueStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Applicant {
  id: string;
  name: string;
  avatarUrl: string;
  urgency: 'Urgent' | 'Standard';
  vehicleType: string;
  licensePlate: string;
  submittedAt: string;
  rawSubmittedDate: string;
  driverId: string;
  vehicleId?: string;
  division: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  licenseExpiry: string;
  nidNumber?: string;
  experienceYears?: number;
  rating?: number;
  totalTrips?: number;
  dutyStatus?: string;
  verifiedAt?: string;
  verifiedByName?: string;
  rejectionReason?: string;
  vehicleModel?: string;
  vehicleManufacturer?: string;
  vehicleYear?: number;
  hasOxygen?: boolean;
  hasVentilator?: boolean;
  hasDefibrillator?: boolean;
  hasSuctionMachine?: boolean;
  equipmentDetails?: string;
  status: 'Awaiting Verification' | 'Approved' | 'Rejected';
  driverVerificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  vehicleVerificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  statusCategory: QueueStatus;
  documents: {
    licenseFront: string;
    licenseBack: string;
    nidFront: string;
    nidBack: string;
    vehicleExterior: string;
    vehicleInterior: string;
    vehicleCabin: string;
  };
  timeline: {
    title: string;
    desc: string;
    time: string;
    status?: 'SUCCESS' | 'IN_PROGRESS' | 'INFO' | 'ERROR';
  }[];
}
