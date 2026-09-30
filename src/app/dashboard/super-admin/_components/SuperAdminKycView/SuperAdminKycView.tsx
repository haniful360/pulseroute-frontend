'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, UserCheck, Clock, FileCheck2 } from 'lucide-react';
import KycQueueList from './KycQueueList';
import KycApplicantDetails from './KycApplicantDetails';
import KycAuditTimeline from './KycAuditTimeline';
import { Applicant } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllDriversAction, verifyDriverAction } from '@/services/driver.service';

export default function SuperAdminKycView() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrivers() {
      setLoading(true);
      try {
        const res = await getAllDriversAction();
        if (res.success && res.data && Array.isArray((res.data as any).data || res.data)) {
          const list = Array.isArray((res.data as any).data) ? (res.data as any).data : res.data;
          if (list.length > 0) {
            const mapped: Applicant[] = list.map((drv: any, idx: number) => {
              const statusCat = drv.verificationStatus === 'APPROVED'
                ? 'Approved'
                : drv.verificationStatus === 'REJECTED'
                  ? 'Rejected'
                  : 'Pending';
              return {
                id: drv.id,
                name: drv.name || drv.user?.name || `Driver ${idx + 1}`,
                avatarUrl: drv.user?.avatarUrl || '/assets/dashboard/driver/dhaka_radar_map.png',
                urgency: drv.verificationStatus === 'PENDING' ? 'Urgent' : 'Standard',
                vehicleType: drv.currentVehicle?.ambulanceType || 'ICU Ambulance',
                licensePlate: drv.currentVehicle?.vehicleNumber || drv.licenseNumber || 'DHA-129-EMG',
                submittedAt: new Date(drv.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
                rawSubmittedDate: drv.createdAt,
                driverId: drv.id,
                division: 'Dhaka Central',
                phone: drv.contactNumber || drv.user?.phone || '+880 1712 345678',
                licenseExpiry: 'Exp: 2028',
                status: drv.verificationStatus === 'APPROVED'
                  ? 'Approved'
                  : drv.verificationStatus === 'REJECTED'
                    ? 'Rejected'
                    : 'Awaiting Verification',
                statusCategory: statusCat,
                documents: {
                  licenseFront: drv.licensePhotoUrl || '',
                  licenseBack: '',
                  nidFront: drv.nidPhotoUrl || '',
                  nidBack: '',
                  vehicleExterior: drv.currentVehicle?.vehiclePhotoUrl || '',
                  vehicleInterior: '',
                  vehicleCabin: '',
                },
                timeline: [
                  {
                    title: 'Registration Application Received',
                    desc: `${drv.name || 'Driver'} submitted BRTA driving credentials and medical fitness certificates.`,
                    time: new Date(drv.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    status: 'SUCCESS',
                  },
                ],
              };
            });
            setApplicants(mapped);
            if (mapped[0]) {
              setSelectedApplicantId(mapped[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load drivers queue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  const selectedApplicant =
    applicants.find((app) => app.id === selectedApplicantId) || applicants[0];

  const handleApprove = async (id: string) => {
    if (!selectedApplicant) return;
    try {
      const res = await verifyDriverAction(selectedApplicant.driverId || id, {
        status: 'APPROVED',
      });
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === id
              ? {
                  ...app,
                  status: 'Approved',
                  statusCategory: 'Approved',
                  timeline: [
                    ...app.timeline,
                    {
                      title: 'Administrative Approval Granted',
                      desc: `Super Admin approved driver credentials and verified fleet compliance.`,
                      time: 'Just now',
                      status: 'SUCCESS',
                    },
                  ],
                }
              : app,
          ),
        );
        toast.success(
          `Driver & Vehicle approved! ${selectedApplicant.name} is now active on the dispatch network.`,
        );
      } else {
        toast.error(res.message || 'Failed to approve driver');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error executing verification approval');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (!selectedApplicant) return;
    try {
      const res = await verifyDriverAction(selectedApplicant.driverId || id, {
        status: 'REJECTED',
        reason,
      });
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === id
              ? {
                  ...app,
                  status: 'Rejected',
                  statusCategory: 'Rejected',
                  timeline: [
                    ...app.timeline,
                    {
                      title: 'Application Rejected',
                      desc: `Reason: ${reason || 'Failed document verification standards.'}`,
                      time: 'Just now',
                      status: 'ERROR',
                    },
                  ],
                }
              : app,
          ),
        );
        toast.error(`Application rejected for ${selectedApplicant.name}. Rejection notice dispatched.`);
      } else {
        toast.error(res.message || 'Failed to reject driver');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error rejecting driver');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-bold tracking-wider text-[#E63946] uppercase">
          SUPER ADMIN CONSOLE
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Driver (KYC) Verification Queue &amp; Audit Trail
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Review Bangladesh Road Transport Authority (BRTA) driving licenses, NID credentials, and
          emergency ambulance fleet compliance.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Left Pane Skeleton */}
          <div className="w-full shrink-0 lg:w-96 rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-36 bg-slate-200" />
              <Skeleton className="h-5 w-12 rounded-full bg-slate-200" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl bg-slate-100" />
            <Skeleton className="h-9 w-full rounded-xl bg-slate-100" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-28 bg-slate-200" />
                      <Skeleton className="h-3 w-36 bg-slate-200" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-4 w-20 rounded bg-slate-200" />
                    <Skeleton className="h-4 w-14 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane Skeleton */}
          <div className="w-full flex-1 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 bg-slate-200" />
                    <Skeleton className="h-4 w-32 bg-slate-200" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-xl bg-slate-200" />
                  <Skeleton className="h-9 w-24 rounded-xl bg-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Skeleton className="h-16 rounded-xl bg-slate-100" />
                <Skeleton className="h-16 rounded-xl bg-slate-100" />
                <Skeleton className="h-16 rounded-xl bg-slate-100" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-5 w-40 bg-slate-200" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-44 rounded-2xl bg-slate-100" />
                  <Skeleton className="h-44 rounded-2xl bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : applicants.length > 0 ? (
        /* Main 2-Pane / 3-Column Verification Workspace */
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Left Pane: Verification Queue (w-full lg:w-96 shrink-0) */}
          <div className="w-full shrink-0 lg:w-96">
            <KycQueueList
              applicants={applicants}
              selectedApplicantId={selectedApplicantId}
              onSelectApplicant={setSelectedApplicantId}
            />
          </div>

          {/* Right Pane: Applicant Details, Documents & Audit Trail (flex-1) */}
          <div className="w-full flex-1 space-y-6">
            {selectedApplicant && (
              <>
                <KycApplicantDetails
                  applicant={selectedApplicant}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />

                <KycAuditTimeline applicant={selectedApplicant} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Queue is Clear</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            There are currently no driver applications pending KYC verification. New registrations will automatically appear here.
          </p>
        </div>
      )}
    </div>
  );
}
