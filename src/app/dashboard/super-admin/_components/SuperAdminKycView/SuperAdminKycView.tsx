'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { initialApplicants } from './kycData';
import KycQueueList from './KycQueueList';
import KycApplicantDetails from './KycApplicantDetails';
import KycAuditTimeline from './KycAuditTimeline';
import { Applicant } from './types';
import { getAllDriversAction, verifyDriverAction } from '@/services/driver.service';

export default function SuperAdminKycView() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>('#9821-V');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDrivers() {
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
      }
    }
    loadDrivers();
  }, []);

  const selectedApplicant =
    applicants.find((app) => app.id === selectedApplicantId) || applicants[0];

  const handleApprove = async (id: string) => {
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
                      desc: `Rejected by Super Admin. Reason: ${reason}`,
                      time: 'Just now',
                      status: 'IN_PROGRESS',
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

      {/* Main 2-Pane / 3-Column Verification Workspace */}
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
          <KycApplicantDetails
            applicant={selectedApplicant}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          <KycAuditTimeline applicant={selectedApplicant} />
        </div>
      </div>
    </div>
  );
}
