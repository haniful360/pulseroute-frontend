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
  division: string;
  phone: string;
  licenseExpiry: string;
  status: 'Awaiting Verification' | 'Approved' | 'Rejected';
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
    status?: 'SUCCESS' | 'IN_PROGRESS' | 'INFO';
  }[];
}
