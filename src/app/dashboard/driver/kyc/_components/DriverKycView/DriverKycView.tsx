'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  CheckCircle2,
  FileCheck,
  FileText,
  Hospital,
  IdCard,
  ShieldCheck,
  UploadCloud,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMyDriverProfileAction } from '@/services/driver/driver.service';
import { DriverKycSkeleton } from '@/components/dashboard/skeletons/driver';

export default function DriverKycView() {
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDriver() {
      try {
        const res = await getMyDriverProfileAction();
        if (res.success && res.data) {
          setDriver(res.data);
        }
      } catch (err) {
        console.error('Failed to load driver KYC profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDriver();
  }, []);
  const documents = [
    {
      title: 'BRTA Professional Driving License',
      ref: 'DL-DH-992144',
      type: 'Heavy / Ambulance Endorsement',
      status: 'Verified',
      expires: 'Exp: 14 Aug 2028',
      icon: IdCard,
    },
    {
      title: 'National Identity Card (NID)',
      ref: 'NID-1988269381023',
      type: 'Election Commission Smart NID',
      status: 'Verified',
      expires: 'Biometrics Authenticated',
      icon: UserCheck,
    },
    {
      title: 'Paramedic CPR & ACLS Certification',
      ref: 'BMDC-ACLS-8812',
      type: 'Bangladesh Medical & Dental Council',
      status: 'Verified',
      expires: 'Exp: 22 Jan 2026',
      icon: Hospital,
    },
    {
      title: 'Dhaka Metropolitan Police Clearance',
      ref: 'DMP-PC-2023-88210',
      type: 'Criminal Background Check Passed',
      status: 'Verified',
      expires: 'Issued: Oct 2023',
      icon: FileCheck,
    },
  ];

  if (loading) {
    return <DriverKycSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="KYC & Legal Verification"
          description="View your verified government licenses, biometric credentials, and hospital certifications."
        />
        <DynamicActionButton
          variant="outline"
          icon={UploadCloud}
          iconPosition="left"
          onClick={() => toast.info('Document re-verification portal ready.')}
          label="Upload Renewal Document"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Main Status Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Verification Status: {driver?.isVerified ? 'Active & Cleared' : 'Under Review'}
                </h3>
                <DynamicBadge
                  text={driver?.isVerified ? 'Approved' : 'Pending'}
                  color={driver?.isVerified ? '#10b981' : '#f59e0b'}
                  size="xs"
                />
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Driver ID: <b className="font-mono text-slate-900">{driver?.id ? `PR-DRV-${driver.id.slice(-4).toUpperCase()}` : 'PR-DRV-9022'}</b> • License: {driver?.licenseNumber || 'DL-DH-992144'}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Full Dispatch Authorization Active
          </span>
        </div>
      </div>

      {/* Document Records Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc, idx) => {
          const Icon = doc.icon;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <DynamicBadge text={doc.status} color="#10b981" size="xs" />
                </div>
                <h4 className="mt-4 text-base font-bold text-slate-900">{doc.title}</h4>
                <p className="mt-1 font-mono text-xs font-semibold text-slate-600">{doc.ref}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{doc.type}</p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{doc.expires}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
