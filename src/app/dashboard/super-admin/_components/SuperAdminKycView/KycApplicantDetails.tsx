'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Activity,
  Car,
  Check,
  CheckCircle2,
  Clock,
  IdCard,
  Mail,
  Maximize2,
  Phone,
  ShieldCheck,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { Applicant } from './types';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import { cn } from '@/lib/utils';

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

  const handleConfirmReject = () => {
    onReject(applicant.id, rejectReason || 'Document clarity or compliance failure');
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Applicant Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Avatar & Meta */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xs sm:h-20 sm:w-20">
              <Image
                src={applicant.avatarUrl}
                alt={applicant.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{applicant.name}</h1>
                {/* Driver Verification Status Badge */}
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
                  DRIVER: {applicant.driverVerificationStatus || applicant.status.toUpperCase()}
                </span>

                {/* Vehicle Verification Status Badge */}
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
                  VEHICLE: {applicant.vehicleVerificationStatus || 'PENDING'}
                </span>

                {/* Duty Status Badge */}
                {applicant.dutyStatus && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      applicant.dutyStatus === 'ONLINE'
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : applicant.dutyStatus === 'BUSY'
                          ? 'border border-amber-200 bg-amber-50 text-amber-700'
                          : 'border border-slate-200 bg-slate-100 text-slate-600',
                    )}
                  >
                    {applicant.dutyStatus}
                  </span>
                )}
              </div>

              {/* Comprehensive Driver Details Row 1 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
                <span>
                  Driver ID:{' '}
                  <strong className="font-semibold text-slate-700">{applicant.driverId}</strong> •{' '}
                  {applicant.division}
                </span>

                {applicant.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <strong className="font-semibold text-slate-700">{applicant.email}</strong>
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <strong className="font-semibold text-slate-700">{applicant.phone}</strong>
                </span>

                <span>
                  License:{' '}
                  <strong className="font-mono font-semibold text-slate-800">
                    {applicant.licenseNumber || 'DL-DH-992144'}
                  </strong>
                </span>

                <span>
                  Exp:{' '}
                  <strong className="font-semibold text-slate-700">
                    {applicant.licenseExpiry}
                  </strong>
                </span>

                <span>
                  Exp Years:{' '}
                  <strong className="font-semibold text-slate-700">
                    {applicant.experienceYears || 5} Yrs
                  </strong>
                </span>

                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <strong className="font-semibold text-slate-700">
                    {(applicant.rating ?? 5.0).toFixed(1)}
                  </strong>
                  <span className="text-slate-400">({applicant.totalTrips ?? 0} trips)</span>
                </span>
              </div>

              {/* Verified By / Rejection Notice Row 2 */}
              {(applicant.verifiedAt || applicant.rejectionReason) && (
                <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px]">
                  {applicant.verifiedAt && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified on {applicant.verifiedAt}
                      {applicant.verifiedByName && (
                        <span className="font-normal text-slate-500">
                          {' '}by <strong className="text-slate-700 font-semibold">{applicant.verifiedByName}</strong>
                        </span>
                      )}
                    </span>
                  )}
                  {applicant.rejectionReason && (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
                      <strong>Rejection Reason:</strong> {applicant.rejectionReason}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Approval & Rejection Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onApprove(applicant.id)}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#E63946] px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Approve Driver &amp; Vehicle</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRejectModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            >
              <X className="h-4 w-4 text-slate-400" />
              <span>Reject with Reason</span>
            </button>
          </div>
        </div>
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
              className="object-contain"
            />
          </div>
        </DynamicModal>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <DynamicModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title="Reject Driver Application"
          subtitle={`Specify reason for rejecting ${applicant.name} (#${applicant.driverId})`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              The driver will be notified with this reason and allowed to re-upload clear documents.
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Driving license photo is blurry; NID details do not match submitted vehicle registration..."
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
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </DynamicModal>
      )}
    </div>
  );
}
