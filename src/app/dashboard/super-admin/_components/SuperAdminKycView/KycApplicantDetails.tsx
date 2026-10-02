'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Check, Maximize2, Phone, ShieldCheck, X } from 'lucide-react';
import { Applicant } from './types';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';

interface KycApplicantDetailsProps {
  applicant: Applicant;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function KycApplicantDetails({
  applicant,
  onApprove,
  onReject,
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

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{applicant.name}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  {applicant.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                <span>
                  Driver ID:{' '}
                  <strong className="font-semibold text-slate-700">{applicant.driverId}</strong> •{' '}
                  {applicant.division}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <strong className="font-semibold text-slate-700">{applicant.phone}</strong>
                </span>
                <span>
                  Exp:{' '}
                  <strong className="font-semibold text-slate-700">
                    {applicant.licenseExpiry}
                  </strong>
                </span>
              </div>
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Professional Driving License
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.licenseFront,
                  title: 'Driving License - Front Side',
                })
              }
              className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#E63946] hover:underline"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full View</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Front Side */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.licenseFront,
                  title: 'Driving License - Front Side',
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

            {/* Back Side */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.licenseBack,
                  title: 'Driving License - Back Side',
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
          </div>
        </div>

        {/* National ID (NID) Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">National ID (NID)</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified via EC</span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Front Side */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.nidFront,
                  title: 'National ID (NID) - Front Side',
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

            {/* Back Side */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.nidBack,
                  title: 'National ID (NID) - Back Side',
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
          </div>
        </div>

        {/* Vehicle Photos Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Vehicle Photos</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#E63946]">
                ICU TYPE
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-500">
                Reg: {applicant.licensePlate}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Exterior Full View */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.vehicleExterior,
                  title: 'Vehicle Exterior - Side Profile',
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

            {/* Medical Bay */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.vehicleInterior,
                  title: 'Vehicle Interior - Medical Bay (ICU Equipment)',
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

            {/* Driver Cabin */}
            <div
              onClick={() =>
                setLightboxImage({
                  url: applicant.documents.vehicleCabin,
                  title: 'Vehicle Interior - Driver Cabin',
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
