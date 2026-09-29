export type Role = 'SUPER_ADMIN' | 'DRIVER' | 'USER';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING_APPROVAL';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AmbulanceType = 'BASIC' | 'AC' | 'ICU' | 'CCU' | 'FREEZER' | 'NEONATAL';
export type DriverVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type DutyStatus = 'ONLINE' | 'OFFLINE' | 'ON_TRIP' | 'BUSY';

export interface IUser {
  id: string;
  name: string;
  email: string;
  googleId?: string | null;
  authProvider?: 'LOCAL' | 'GOOGLE';
  phone?: string | null;
  avatarUrl?: string | null;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPatientProfile {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  bloodGroup?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  medicalHistory?: string | null;
  profilePhoto?: string | null;
  userId?: string;
}

export interface IDriverProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  contactNumber: string;
  licenseNumber: string;
  licenseExpiry?: string | null;
  nidNumber?: string | null;
  experienceYears: number;
  verificationStatus: DriverVerificationStatus;
  dutyStatus: DutyStatus;
  rating?: number;
  totalTrips?: number;
  currentVehicleId?: string | null;
  currentVehicle?: {
    id: string;
    vehicleNumber: string;
    ambulanceType: AmbulanceType;
    model?: string;
    manufacturer?: string;
  } | null;
  wallet?: {
    id: string;
    balance: number;
  } | null;
}

export interface IAdminProfile {
  id: string;
  name: string;
  email: string;
  orgEmail?: string | null;
  contactNumber?: string | null;
  department?: string | null;
  userId?: string;
}

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  bloodGroup?: string;
  gender?: Gender;
  dateOfBirth?: string;
  medicalHistory?: string;
}

export interface IRegisterDriverPayload {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  licenseNumber: string;
  licenseExpiry?: string;
  nidNumber?: string;
  experienceYears?: number;
  vehicleNumber?: string;
  ambulanceType?: AmbulanceType;
  model?: string;
  manufacturer?: string;
  year?: number;
  hasOxygen?: boolean;
  hasVentilator?: boolean;
  hasDefibrillator?: boolean;
  hasSuctionMachine?: boolean;
  equipmentDetails?: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IResendOtpPayload {
  email: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IGoogleLoginPayload {
  token?: string;
  idToken?: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IAuthData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  patient?: IPatientProfile;
  driver?: IDriverProfile;
  admin?: IAdminProfile;
  welcomeMessage?: string;
}

export interface IMeResponseData {
  user: IUser;
  profile: IPatientProfile | IDriverProfile | IAdminProfile | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  errorSources?: Array<{ path: string | number; message: string }>;
}
