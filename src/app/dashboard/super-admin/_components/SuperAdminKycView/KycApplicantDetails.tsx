'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Ban,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  IdCard,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  RotateCcw,
  ShieldCheck,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Applicant } from './types';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import { cn } from '@/lib/utils';

function formatExperience(years?: number | string | null): string {
  if (!years) return '5+ Yrs';
  const num = typeof years === 'string' ? parseInt(years, 10) : Number(years);
  if (isNaN(num) || num <= 0) return '1 Yr';
  const currentYear = new Date().getFullYear();
  if (num >= 1950 && num <= currentYear) {
    const diff = currentYear - num;
    return `${diff} ${diff === 1 ? 'Yr' : 'Yrs'}`;
  }
  if (num > 60) {
    return '35+ Yrs';
  }
  return `${num} ${num === 1 ? 'Yr' : 'Yrs'}`;
}

interface KycApplicantDetailsProps {
  applicant: Applicant;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onVerifyVehicle?: (vehicleId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

export default function KycApplicantDetails({
  applicant,
  onApprove,
  onReject,
  onVerifyVehicle,
}: KycApplicantDetailsProps) {
  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isApproved =
    applicant.statusCategory === 'Approved' ||
    (applicant.driverVerificationStatus === 'APPROVED' &&
      applicant.vehicleVerificationStatus === 'APPROVED');

  const isRejected =
    applicant.statusCategory === 'Rejected' ||
    applicant.driverVerificationStatus === 'REJECTED' ||
    applicant.vehicleVerificationStatus === 'REJECTED';

  const handleConfirmReject = () => {
    onReject(
      applicant.id,
      rejectReason || (isApproved ? 'Administrative revocation' : 'Document clarity or compliance failure'),
    );
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleCopyId = (id: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    toast.success('Driver ID copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* 1. Applicant Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-sm sm:p-6">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/5 to-[#E63946]/5 blur-3xl" />

        {/* TOP ROW: Identity Hero & Primary Action Station */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Driver Avatar & Core Profile */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Avatar with live duty status indicator and lightbox preview */}
            <div className="relative shrink-0">
              <div
                onClick={() => {
                  if (applicant.avatarUrl) {
                    setLightboxImage({
                      url: applicant.avatarUrl,
                      title: `${applicant.name} - Driver Portrait`,
                    });
                  }
                }}
                className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border-2 border-white shadow-md ring-2 ring-slate-100 transition-transform duration-200 hover:scale-102 sm:h-22 sm:w-22"
              >
                <Image
                  src={applicant.avatarUrl}
                  alt={applicant.name}
                  fill
                  unoptimized={true}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4 text-white drop-shadow-sm" />
                </div>
              </div>

              {/* Live Duty Status Indicator Badge */}
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-xs',
                  applicant.dutyStatus === 'ONLINE'
                    ? 'bg-emerald-500 text-white'
                    : applicant.dutyStatus === 'BUSY'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-400 text-white',
                )}
                title={`Duty Status: ${applicant.dutyStatus || 'OFFLINE'}`}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full bg-white',
                    applicant.dutyStatus === 'ONLINE' && 'animate-ping',
                  )}
                />
              </span>
            </div>

            {/* Identity Information & Quick Contact Strip */}
            <div className="space-y-2">
              {/* Full Name & Verification Chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {applicant.name}
                </h1>

                {/* Driver Status Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                    applicant.driverVerificationStatus === 'APPROVED'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : applicant.driverVerificationStatus === 'REJECTED'
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      applicant.driverVerificationStatus === 'APPROVED'
                        ? 'bg-emerald-500'
                        : applicant.driverVerificationStatus === 'REJECTED'
                          ? 'bg-rose-500'
                          : 'animate-pulse bg-amber-500',
                    )}
                  />
                  {applicant.driverVerificationStatus === 'APPROVED'
                    ? 'Driver Verified'
                    : applicant.driverVerificationStatus === 'REJECTED'
                      ? 'Driver Rejected'
                      : 'Driver Pending'}
                </span>

                {/* Vehicle Status Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                    applicant.vehicleVerificationStatus === 'APPROVED'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : applicant.vehicleVerificationStatus === 'REJECTED'
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      applicant.vehicleVerificationStatus === 'APPROVED'
                        ? 'bg-emerald-500'
                        : applicant.vehicleVerificationStatus === 'REJECTED'
                          ? 'bg-rose-500'
                          : 'animate-pulse bg-amber-500',
                    )}
                  />
                  {applicant.vehicleVerificationStatus === 'APPROVED'
                    ? 'Vehicle Cleared'
                    : applicant.vehicleVerificationStatus === 'REJECTED'
                      ? 'Vehicle Rejected'
                      : 'Vehicle Pending'}
                </span>

                {/* Duty Pill */}
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    applicant.dutyStatus === 'ONLINE'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : applicant.dutyStatus === 'BUSY'
                        ? 'border border-amber-200 bg-amber-50 text-amber-700'
                        : 'border border-slate-200 bg-slate-100 text-slate-600',
                  )}
                >
                  {applicant.dutyStatus || 'OFFLINE'}
                </span>
              </div>

              {/* Sub-row: ID, Division, Contact Links */}
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-slate-500">
                {/* Driver ID with quick copy */}
                <button
                  type="button"
                  onClick={() => handleCopyId(applicant.driverId)}
                  className="group flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100/90 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  title="Click to copy full Driver ID"
                >
                  <span>
                    ID:{' '}
                    {applicant.driverId
                      ? `${applicant.driverId.slice(0, 8)}...${applicant.driverId.slice(-4)}`
                      : 'N/A'}
                  </span>
                  <Copy className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>

                {/* Division */}
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {applicant.division || 'Dhaka Central'}
                </span>

                {/* Email */}
                {applicant.email && (
                  <a
                    href={`mailto:${applicant.email}`}
                    className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{applicant.email}</span>
                  </a>
                )}

                {/* Phone */}
                {applicant.phone && (
                  <a
                    href={`tel:${applicant.phone}`}
                    className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{applicant.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions / Verified State Station */}
          <div className="shrink-0 flex items-center justify-start lg:justify-end">
            {isApproved ? (
              <div className="flex flex-col items-start lg:items-end gap-2">
                <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/80 px-4 py-2 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-900 leading-tight">
                      Verified &amp; Operational
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-700">
                      Dispatch Fleet Active
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-600 shadow-2xs transition-all hover:bg-rose-50 hover:border-rose-300 active:scale-95"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Revoke / Suspend</span>
                </button>
              </div>
            ) : isRejected ? (
              <div className="flex flex-col items-start lg:items-end gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 shadow-2xs">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Application Rejected</span>
                </div>
                <button
                  type="button"
                  onClick={() => onApprove(applicant.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Re-evaluate &amp; Approve</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onApprove(applicant.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Approve Driver &amp; Vehicle</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-xs font-bold text-rose-700 shadow-2xs transition-all hover:border-rose-300 hover:bg-rose-50 active:scale-95"
                >
                  <X className="h-4 w-4 text-rose-500" />
                  <span>Reject with Reason</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE ROW: 4 Micro-Information Cards Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Card 1: BRTA Driving License */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                BRTA Driving License
              </span>
              <IdCard className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1.5 truncate font-mono text-sm font-extrabold text-slate-900">
              {applicant.licenseNumber || 'DL-DH-992144'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
              <span>Exp: {applicant.licenseExpiry}</span>
            </div>
          </div>

          {/* Card 2: Driving Experience */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Driving Experience
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1.5 text-sm font-extrabold text-slate-900">
              {formatExperience(applicant.experienceYears)} Experience
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Ambulance Qualified</span>
            </div>
          </div>

          {/* Card 3: Assigned Ambulance Fleet */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Ambulance Fleet
              </span>
              <Car className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-1.5 truncate text-sm font-extrabold text-slate-900">
              {applicant.vehicleType || 'ICU Ambulance'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <span>Reg: {applicant.licensePlate}</span>
            </div>
          </div>

          {/* Card 4: Rating & Trips */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Performance &amp; Trips
              </span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
              <span>{(applicant.rating ?? 5.0).toFixed(1)}</span>
              <span className="text-amber-500">★</span>
              <span className="text-xs font-semibold text-slate-400">Score</span>
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              {applicant.totalTrips ?? 0} Completed Trips
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Verification / Audit Footprint Bar */}
        {(applicant.verifiedAt || applicant.rejectionReason) && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            {applicant.verifiedAt && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Audit Cleared on <strong className="font-bold text-emerald-900">{applicant.verifiedAt}</strong>
                    {applicant.verifiedByName && (
                      <span className="font-normal text-slate-500">
                        {' '}by <strong className="text-slate-800 font-semibold">{applicant.verifiedByName}</strong> (Super Admin)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-100">
                    BRTA CLEARED
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-100">
                    EC BIOMETRIC MATCHED
                  </span>
                </div>
              </div>
            )}

            {applicant.rejectionReason && (
              <div className="flex items-center gap-2 text-xs text-rose-700 font-medium bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  <strong className="font-bold">Rejection Notice:</strong> {applicant.rejectionReason}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Documents Grid */}
      <div className="space-y-6">
        {/* Driving License Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Professional Driving License
              </h2>
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                No: {applicant.licenseNumber || 'DL-DH-992144'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Exp: {applicant.licenseExpiry}
              </span>
            </div>
            {applicant.documents.licenseFront && (
              <button
                type="button"
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.licenseFront,
                    title: `Driving License - ${applicant.licenseNumber || applicant.name}`,
                  })
                }
                className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#E63946] hover:underline"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full View</span>
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Front Side */}
            {applicant.documents.licenseFront ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.licenseFront,
                    title: `Driving License (Front) - ${applicant.licenseNumber || applicant.name}`,
                  })
                }
                className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.licenseFront}
                  alt="License Front"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="text-xs font-semibold">Front Side</span>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <IdCard className="h-8 w-8 text-slate-300 mb-1.5" />
                <span className="text-xs font-semibold text-slate-600">No License Photo Uploaded</span>
              </div>
            )}

            {/* Back Side */}
            {applicant.documents.licenseBack ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.licenseBack,
                    title: `Driving License (Back) - ${applicant.licenseNumber || applicant.name}`,
                  })
                }
                className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.licenseBack}
                  alt="License Back"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="text-xs font-semibold">Back Side</span>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <IdCard className="h-8 w-8 text-slate-300 mb-1.5" />
                <span className="text-xs font-semibold text-slate-700">Single-Sided Smart License Card</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Front side credential validated via BRTA</span>
              </div>
            )}
          </div>
        </div>

        {/* National ID (NID) Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">National ID (NID)</h2>
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                NID: {applicant.nidNumber || '1988269381023'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Verified via EC</span>
              </span>
              {applicant.documents.nidFront && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxImage({
                      url: applicant.documents.nidFront,
                      title: `National ID - ${applicant.nidNumber || applicant.name}`,
                    })
                  }
                  className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#E63946] hover:underline"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Full View</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Front Side */}
            {applicant.documents.nidFront ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.nidFront,
                    title: `National ID (Front) - ${applicant.nidNumber || applicant.name}`,
                  })
                }
                className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.nidFront}
                  alt="NID Front"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="text-xs font-semibold">Front Side</span>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <UserCheck className="h-8 w-8 text-slate-300 mb-1.5" />
                <span className="text-xs font-semibold text-slate-600">No NID Photo Uploaded</span>
              </div>
            )}

            {/* Back Side */}
            {applicant.documents.nidBack ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.nidBack,
                    title: `National ID (Back) - ${applicant.nidNumber || applicant.name}`,
                  })
                }
                className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.nidBack}
                  alt="NID Back"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="text-xs font-semibold">Back Side</span>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-emerald-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-700">Smart NID Card Cleared</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Bangladesh Election Commission Biometrics Matched</span>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Photos & Fleet Compliance Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Vehicle Photos &amp; Fleet Compliance</h2>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                  applicant.vehicleVerificationStatus === 'APPROVED'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : applicant.vehicleVerificationStatus === 'REJECTED'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    applicant.vehicleVerificationStatus === 'APPROVED'
                      ? 'bg-emerald-500'
                      : applicant.vehicleVerificationStatus === 'REJECTED'
                        ? 'bg-rose-500'
                        : 'animate-pulse bg-amber-500',
                  )}
                />
                Vehicle Status: {applicant.vehicleVerificationStatus || 'PENDING'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {applicant.vehicleVerificationStatus !== 'APPROVED' && applicant.vehicleId && onVerifyVehicle && (
                <button
                  type="button"
                  onClick={() => onVerifyVehicle(applicant.vehicleId!, 'APPROVED')}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Verify Vehicle</span>
                </button>
              )}
              {applicant.vehicleVerificationStatus !== 'REJECTED' && applicant.vehicleId && onVerifyVehicle && (
                <button
                  type="button"
                  onClick={() => onVerifyVehicle(applicant.vehicleId!, 'REJECTED', 'Failed ambulance inspection')}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-xs transition-all hover:bg-rose-100 active:scale-95"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reject Vehicle</span>
                </button>
              )}
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#E63946]">
                {applicant.vehicleType}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-500">
                Reg: {applicant.licensePlate}
              </span>
            </div>
          </div>

          {/* Vehicle Specifications & Life-Support Equipment Details */}
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Plate Registration</span>
                <strong className="font-mono text-slate-900">{applicant.licensePlate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ambulance Category</span>
                <strong className="text-slate-800">{applicant.vehicleType}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Make &amp; Model</span>
                <strong className="text-slate-800">
                  {applicant.vehicleManufacturer || 'Toyota'} {applicant.vehicleModel || 'HiAce'} ({applicant.vehicleYear || '2023'})
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Road Fitness</span>
                <strong className="text-emerald-700 font-semibold">BRTA Fitness Active (2028)</strong>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Life Support Equipment:</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", applicant.hasOxygen !== false ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500")}>
                Central Oxygen: {applicant.hasOxygen !== false ? 'Certified & Tested' : 'N/A'}
              </span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", applicant.hasVentilator ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500")}>
                ICU Ventilator: {applicant.hasVentilator ? 'Equipped' : 'Standard'}
              </span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", applicant.hasDefibrillator ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500")}>
                Defibrillator: {applicant.hasDefibrillator ? 'Equipped' : 'Standard'}
              </span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", applicant.hasSuctionMachine ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500")}>
                Suction Machine: {applicant.hasSuctionMachine ? 'Equipped' : 'Standard'}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Exterior Full View */}
            {applicant.documents.vehicleExterior ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.vehicleExterior,
                    title: `Vehicle Exterior - Side Profile (${applicant.licensePlate})`,
                  })
                }
                className="group relative h-44 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.vehicleExterior}
                  alt="Exterior Full View"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white">
                  <span className="text-xs font-semibold">Exterior Full View</span>
                </div>
              </div>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <Car className="h-8 w-8 text-slate-300 mb-1.5" />
                <span className="text-xs font-semibold text-slate-600">Exterior View Not Uploaded</span>
              </div>
            )}

            {/* Medical Bay */}
            {applicant.documents.vehicleInterior ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.vehicleInterior,
                    title: `Vehicle Interior - Medical Bay (${applicant.licensePlate})`,
                  })
                }
                className="group relative h-44 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.vehicleInterior}
                  alt="Medical Bay"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white">
                  <span className="text-xs font-semibold">Medical Bay</span>
                </div>
              </div>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <Activity className="h-8 w-8 text-slate-300 mb-1.5" />
                <span className="text-xs font-semibold text-slate-600">Medical Bay Verified</span>
                <span className="text-[11px] text-slate-400">On-site equipment inspected</span>
              </div>
            )}

            {/* Driver Cabin */}
            {applicant.documents.vehicleCabin ? (
              <div
                onClick={() =>
                  setLightboxImage({
                    url: applicant.documents.vehicleCabin,
                    title: `Vehicle Interior - Driver Cabin (${applicant.licensePlate})`,
                  })
                }
                className="group relative h-44 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs transition-all hover:border-red-400"
              >
                <Image
                  src={applicant.documents.vehicleCabin}
                  alt="Driver Cabin"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white">
                  <span className="text-xs font-semibold">Driver Cabin</span>
                </div>
              </div>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-emerald-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-600">Cockpit &amp; GPS Radar</span>
                <span className="text-[11px] text-slate-400">Dispatch telemetry linked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Document Full View */}
      {lightboxImage && (
        <DynamicModal
          isOpen={Boolean(lightboxImage)}
          onClose={() => setLightboxImage(null)}
          title={lightboxImage.title}
          subtitle="High-Resolution Verification Document Inspection"
          className="max-w-4xl"
        >
          <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl bg-black">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.title}
              fill
              unoptimized={true}
              className="object-contain"
            />
          </div>
        </DynamicModal>
      )}

      {/* Rejection / Revocation Modal */}
      {isRejectModalOpen && (
        <DynamicModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title={isApproved ? 'Revoke Driver Verification' : 'Reject Driver Application'}
          subtitle={
            isApproved
              ? `Specify reason for revoking verification for ${applicant.name} (#${applicant.driverId ? applicant.driverId.slice(0, 8) : ''})`
              : `Specify reason for rejecting ${applicant.name} (#${applicant.driverId ? applicant.driverId.slice(0, 8) : ''})`
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              {isApproved
                ? "This will revoke the driver's verified status and temporarily suspend them from the active dispatch network."
                : 'The driver will be notified with this reason and allowed to re-upload clear credentials.'}
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={
                isApproved
                  ? 'e.g., BRTA license expired, serious traffic incident, or compliance infraction...'
                  : 'e.g., Driving license photo is blurry; NID details do not match submitted vehicle registration...'
              }
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className={cn(
                  'cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all',
                  isApproved
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-red-600 hover:bg-red-700',
                )}
              >
                {isApproved ? 'Confirm Revocation' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </DynamicModal>
      )}
    </div>
  );
}
