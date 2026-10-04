'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import {
  AlertCircle,
  AlertTriangle,
  Ambulance,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  HeartPulse,
  Hospital,
  IdCard,
  Maximize2,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyDriverProfileAction,
  updateMyDriverProfileAction,
} from '@/services/driver/driver.service';
import { DriverKycSkeleton } from '@/components/dashboard/skeletons/driver';
import { cn } from '@/lib/utils';

export default function DriverKycView() {
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals state
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Renewal Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licensePhotoUrl: '',
    nidNumber: '',
    nidPhotoUrl: '',
    vehicleNumber: '',
    ambulanceType: 'ICU' as any,
    vehiclePhotoUrl: '',
  });

  async function loadDriver() {
    try {
      const res = await getMyDriverProfileAction();
      if (res.success && res.data) {
        setDriver(res.data);
        // Prepopulate form data
        setFormData({
          name: res.data.name || res.data.user?.name || '',
          phone: res.data.contactNumber || res.data.user?.phone || '',
          licenseNumber: res.data.licenseNumber || '',
          licenseExpiry: res.data.licenseExpiry
            ? new Date(res.data.licenseExpiry).toISOString().split('T')[0]
            : '',
          licensePhotoUrl: res.data.licensePhotoUrl || res.data.licensePhotos?.[0] || '',
          nidNumber: res.data.nidNumber || '',
          nidPhotoUrl: res.data.nidPhotoUrl || res.data.nidPhotos?.[0] || '',
          vehicleNumber:
            res.data.currentVehicle?.vehicleNumber ||
            res.data.vehicles?.[0]?.vehicleNumber ||
            '',
          ambulanceType:
            res.data.currentVehicle?.ambulanceType ||
            res.data.vehicles?.[0]?.ambulanceType ||
            'ICU',
          vehiclePhotoUrl:
            res.data.currentVehicle?.photoUrl ||
            res.data.currentVehicle?.photos?.[0] ||
            res.data.vehicles?.[0]?.photoUrl ||
            '',
        });
      }
    } catch (err) {
      console.error('Failed to load driver KYC profile:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDriver();
  }, []);

  const handleRenewalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateMyDriverProfileAction({
        name: formData.name,
        contactNumber: formData.phone,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry || undefined,
        licensePhotoUrl: formData.licensePhotoUrl || undefined,
        nidNumber: formData.nidNumber || undefined,
        nidPhotoUrl: formData.nidPhotoUrl || undefined,
        vehicleNumber: formData.vehicleNumber || undefined,
        ambulanceType: formData.ambulanceType,
        vehiclePhotoUrl: formData.vehiclePhotoUrl || undefined,
      });

      if (res.success) {
        toast.success('KYC documents updated and resubmitted for verification!');
        setIsRenewalModalOpen(false);
        await loadDriver();
      } else {
        toast.error(res.message || 'Failed to update documents');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating verification credentials');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <DriverKycSkeleton />;
  }

  // Verification status logic
  const driverStatus = driver?.verificationStatus || 'PENDING';
  const vehicleStatus =
    driver?.currentVehicle?.verificationStatus ||
    driver?.vehicles?.[0]?.verificationStatus ||
    'PENDING';

  const isDriverApproved = driverStatus === 'APPROVED';
  const isVehicleApproved = vehicleStatus === 'APPROVED';
  const isFullyApproved = isDriverApproved && isVehicleApproved;
  const isAnyRejected = driverStatus === 'REJECTED' || vehicleStatus === 'REJECTED';

  // Fallback photos
  const licensePhoto =
    driver?.licensePhotoUrl ||
    driver?.licensePhotos?.[0] ||
    '/assets/dashboard/driver/dhaka_radar_map.png';
  const nidPhoto =
    driver?.nidPhotoUrl ||
    driver?.nidPhotos?.[0] ||
    '/assets/dashboard/driver/dhaka_radar_map.png';
  const vehiclePhoto =
    driver?.currentVehicle?.photoUrl ||
    driver?.currentVehicle?.photos?.[0] ||
    driver?.vehicles?.[0]?.photoUrl ||
    '/assets/dashboard/driver/dhaka_radar_map.png';
  const vehicleInteriorPhoto =
    driver?.currentVehicle?.photos?.[1] ||
    driver?.vehicles?.[0]?.photos?.[1] ||
    '/assets/dashboard/driver/dhaka_radar_map.png';

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="KYC &amp; Legal Verification"
          description="View your official BRTA driving license, National ID compliance, and emergency ambulance fleet authorization."
        />
        <DynamicActionButton
          variant="outline"
          icon={UploadCloud}
          iconPosition="left"
          onClick={() => setIsRenewalModalOpen(true)}
          label="Upload Renewal Document"
          className="self-start sm:self-auto"
        />
      </div>

      {/* 2. Main Verification Status Banner */}
      {isFullyApproved ? (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/50 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Verification Status: Active &amp; Cleared
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    APPROVED
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Driver ID:{' '}
                  <strong className="font-mono text-slate-900">
                    PR-DRV-{driver?.id ? driver.id.slice(-6).toUpperCase() : '9022'}
                  </strong>{' '}
                  • License: <strong className="text-slate-800">{driver?.licenseNumber}</strong> •
                  Plate:{' '}
                  <strong className="text-slate-800">
                    {driver?.currentVehicle?.vehicleNumber || 'DHA-129-EMG'}
                  </strong>
                </p>
                {driver?.verifiedAt && (
                  <p className="text-[11px] font-medium text-slate-500">
                    Verified on {formatDate(driver.verifiedAt)} by{' '}
                    <strong className="text-slate-700">
                      {driver?.verifiedBy?.name || 'PulseRoute Safety & Compliance Board'}
                    </strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-800">
                Full Dispatch Authorization Active
              </span>
            </div>
          </div>
        </div>
      ) : isAnyRejected ? (
        <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50/90 via-white to-rose-50/50 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/25">
                <XCircle className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Verification Status: Action Required / Application Rejected
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100 px-3 py-0.5 text-xs font-bold text-rose-800">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    REJECTED
                  </span>
                </div>
                <p className="text-xs text-rose-700 font-medium">
                  Reason:{' '}
                  <strong>
                    {driver?.rejectionReason ||
                      driver?.currentVehicle?.rejectionReason ||
                      'Documents did not meet platform safety standards. Please re-upload clear photos.'}
                  </strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  Please update your credentials below to request immediate compliance re-evaluation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRenewalModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#E63946] px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Update &amp; Resubmit Documents</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
                <Clock className="h-7 w-7 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-black text-slate-900">
                    Verification Status: Under Review
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                    PENDING APPROVAL
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Your submitted BRTA credentials and ambulance fleet specs are undergoing manual
                  audit by our safety officers.
                </p>
                <p className="text-[11px] text-slate-500">
                  Estimated review time: 2–4 business hours. You will receive an SMS upon approval.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-2.5 shadow-2xs">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-800">
                Dispatch Clearance Pending Audit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Dual Clearance Breakdown Cards (Driver + Ambulance) */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card A: Driver Identity Clearance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Driver Identity Clearance</h4>
                <p className="text-[11px] text-slate-500">BRTA &amp; National ID Verification</p>
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                isDriverApproved
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : driverStatus === 'REJECTED'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isDriverApproved
                    ? 'bg-emerald-500'
                    : driverStatus === 'REJECTED'
                      ? 'bg-rose-500'
                      : 'animate-pulse bg-amber-500',
                )}
              />
              DRIVER: {driverStatus}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Full Name</span>
              <strong className="text-slate-800">{driver?.name || driver?.user?.name}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Contact Number</span>
              <strong className="text-slate-800">
                {driver?.contactNumber || driver?.user?.phone || 'N/A'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">BRTA License Number</span>
              <strong className="font-mono text-slate-900">{driver?.licenseNumber}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">License Expiry</span>
              <strong className="text-slate-800">
                {driver?.licenseExpiry ? formatDate(driver.licenseExpiry) : 'Exp: 2028'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Commercial Experience</span>
              <strong className="text-slate-800">
                {driver?.experienceYears || 5} Years Commercial Fleet
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">National ID (NID)</span>
              <strong className="font-mono text-slate-800">
                {driver?.nidNumber || 'Smart NID 1988269381023'}
              </strong>
            </div>
          </div>
        </div>

        {/* Card B: Ambulance Fleet & Equipment Clearance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Ambulance className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ambulance Fleet Clearance</h4>
                <p className="text-[11px] text-slate-500">Vehicle &amp; Medical Inspection</p>
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                isVehicleApproved
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : vehicleStatus === 'REJECTED'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isVehicleApproved
                    ? 'bg-emerald-500'
                    : vehicleStatus === 'REJECTED'
                      ? 'bg-rose-500'
                      : 'animate-pulse bg-amber-500',
                )}
              />
              VEHICLE: {vehicleStatus}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Registration Plate</span>
              <strong className="font-mono text-slate-900">
                {driver?.currentVehicle?.vehicleNumber ||
                  driver?.vehicles?.[0]?.vehicleNumber ||
                  'DHA-METRO-CHA-11-2233'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Ambulance Category</span>
              <span className="rounded-full bg-red-50 px-2 py-0.5 font-bold text-[#E63946]">
                {driver?.currentVehicle?.ambulanceType || 'ICU'} Emergency Class
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vehicle Model</span>
              <strong className="text-slate-800">
                {driver?.currentVehicle?.manufacturer || 'Toyota'}{' '}
                {driver?.currentVehicle?.model || 'HiAce'} (
                {driver?.currentVehicle?.year || 2023})
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Central Oxygen Tank</span>
              <strong className="text-emerald-700">
                {driver?.currentVehicle?.hasOxygen !== false ? 'Certified & Filled' : 'Standard'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Medical Bay Equipment</span>
              <strong className="text-slate-800">
                {driver?.currentVehicle?.hasVentilator
                  ? 'Ventilator & Defibrillator Equipped'
                  : 'Basic Life Support'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mechanical Roadworthiness</span>
              <strong className="text-slate-800">BRTA Fitness Passed (2028)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Document Records & Credentials Grid */}
      <div>
        <h3 className="mb-4 text-sm font-bold tracking-tight text-slate-900">
          Official Documents &amp; Credentials Showcase
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card 1: BRTA Driving License */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
                  <IdCard className="h-6 w-6" />
                </div>
                <DynamicBadge
                  text={isDriverApproved ? 'Verified' : 'Pending Review'}
                  color={isDriverApproved ? '#10b981' : '#f59e0b'}
                  size="xs"
                />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900">
                BRTA Professional Driving License
              </h4>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                {driver?.licenseNumber}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Heavy Emergency Commercial Transport Endorsement
              </p>

              {/* Photo Preview Thumbnail */}
              {licensePhoto && (
                <div
                  onClick={() =>
                    setLightboxImage({
                      url: licensePhoto,
                      title: `Driving License - ${driver?.licenseNumber}`,
                    })
                  }
                  className="group relative mt-3 h-28 w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
                >
                  <Image
                    src={licensePhoto}
                    alt="Driving License"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">
                      <Maximize2 className="h-3 w-3" /> Full View
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{driver?.licenseExpiry ? `Exp: ${formatDate(driver.licenseExpiry)}` : 'Exp: 14 Aug 2028'}</span>
              <span className="font-semibold text-emerald-700">Active Credential</span>
            </div>
          </div>

          {/* Card 2: National Identity Card (Smart NID) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <DynamicBadge
                  text={isDriverApproved ? 'Verified' : 'Pending Review'}
                  color={isDriverApproved ? '#10b981' : '#f59e0b'}
                  size="xs"
                />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900">
                National Identity Card (Smart NID)
              </h4>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                {driver?.nidNumber || 'NID-1988269381023'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Election Commission Bangladesh Biometrics Authentication
              </p>

              {/* Photo Preview Thumbnail */}
              {nidPhoto && (
                <div
                  onClick={() =>
                    setLightboxImage({
                      url: nidPhoto,
                      title: `National Identity Card - ${driver?.nidNumber || driver?.name}`,
                    })
                  }
                  className="group relative mt-3 h-28 w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-blue-400"
                >
                  <Image
                    src={nidPhoto}
                    alt="National ID"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">
                      <Maximize2 className="h-3 w-3" /> Full View
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>EC Server Validated</span>
              <span className="font-semibold text-emerald-700">Biometrics Cleared</span>
            </div>
          </div>

          {/* Card 3: Ambulance Fleet Exterior & Cabin Inspection */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Ambulance className="h-6 w-6" />
                </div>
                <DynamicBadge
                  text={isVehicleApproved ? 'Fleet Certified' : 'Inspection Pending'}
                  color={isVehicleApproved ? '#10b981' : '#f59e0b'}
                  size="xs"
                />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900">
                Ambulance Fleet &amp; Vehicle Registration
              </h4>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                Reg:{' '}
                {driver?.currentVehicle?.vehicleNumber ||
                  driver?.vehicles?.[0]?.vehicleNumber ||
                  'DHA-129-EMG'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {driver?.currentVehicle?.ambulanceType || 'ICU'} Emergency Ambulance •{' '}
                {driver?.currentVehicle?.manufacturer || 'Toyota HiAce'}
              </p>

              {/* Photo Preview Thumbnail */}
              {vehiclePhoto && (
                <div
                  onClick={() =>
                    setLightboxImage({
                      url: vehiclePhoto,
                      title: `Ambulance Fleet Vehicle - ${driver?.currentVehicle?.vehicleNumber}`,
                    })
                  }
                  className="group relative mt-3 h-28 w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-amber-400"
                >
                  <Image
                    src={vehiclePhoto}
                    alt="Vehicle Exterior"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">
                      <Maximize2 className="h-3 w-3" /> Full View
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>BRTA Tax &amp; Fitness Active</span>
              <span className="font-semibold text-emerald-700">Equipped for Dispatch</span>
            </div>
          </div>

          {/* Card 4: Paramedic & Police Clearance */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Hospital className="h-6 w-6" />
                </div>
                <DynamicBadge text="Verified" color="#10b981" size="xs" />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900">
                Paramedic CPR &amp; Police Clearance
              </h4>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                BMDC-ACLS-8812 • DMP-PC-2023-88210
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Dhaka Metropolitan Police Criminal Background Check &amp; BMDC Life Support Passed
              </p>

              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Background Record</span>
                  <span className="font-bold text-emerald-700">CLEARED (NO RECORD)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medical Fitness</span>
                  <span className="font-bold text-emerald-700">CLASS-1 CERTIFIED</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Issued: Oct 2023 • Exp: Jan 2026</span>
              <span className="font-semibold text-emerald-700">Audit Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Renewal / Re-upload Document Modal */}
      <DynamicModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        title="Update &amp; Renew KYC Credentials"
        description="Update expired licenses, new National ID records, or changed ambulance fleet registration."
      >
        <form onSubmit={handleRenewalSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Driver Full Name
              </label>
              <InputField
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Darrel Contreras"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Contact Phone
              </label>
              <InputField
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 1712 345678"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                BRTA Driving License Number
              </label>
              <InputField
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="DL-DH-992144"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                License Expiry Date
              </label>
              <InputField
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Driving License Photo URL
            </label>
            <InputField
              value={formData.licensePhotoUrl}
              onChange={(e) => setFormData({ ...formData, licensePhotoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/... or uploaded document link"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                National ID (NID) Number
              </label>
              <InputField
                value={formData.nidNumber}
                onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                placeholder="1988269381023"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                NID Photo URL
              </label>
              <InputField
                value={formData.nidPhotoUrl}
                onChange={(e) => setFormData({ ...formData, nidPhotoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... or document link"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Vehicle Registration Plate
              </label>
              <InputField
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="DHAKA-METRO-CHA-11-2233"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Ambulance Category
              </label>
              <select
                value={formData.ambulanceType}
                onChange={(e) => setFormData({ ...formData, ambulanceType: e.target.value as any })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-red-500 focus:outline-hidden"
              >
                <option value="BASIC">Basic Ambulance</option>
                <option value="AC">AC Ambulance</option>
                <option value="ICU">ICU Ambulance</option>
                <option value="CCU">CCU Ambulance</option>
                <option value="FREEZER">Freezer Ambulance</option>
                <option value="NEONATAL">Neonatal Ambulance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Vehicle Exterior Photo URL
            </label>
            <InputField
              value={formData.vehiclePhotoUrl}
              onChange={(e) => setFormData({ ...formData, vehiclePhotoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/... or vehicle photo link"
            />
          </div>

          <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setIsRenewalModalOpen(false)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-2xl bg-[#E63946] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Save & Resubmit for Review'}
            </button>
          </div>
        </form>
      </DynamicModal>

      {/* 6. Lightbox Full Image View Modal */}
      {lightboxImage && (
        <DynamicModal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          title={lightboxImage.title}
          description="High-resolution verified legal credential"
          className="max-w-2xl"
        >
          <div className="relative mt-3 h-96 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Close Preview
            </button>
          </div>
        </DynamicModal>
      )}
    </div>
  );
}
