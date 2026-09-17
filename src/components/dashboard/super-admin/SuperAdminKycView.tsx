'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { initialApplicants } from './kycData';
import KycQueueList from './KycQueueList';
import KycApplicantDetails from './KycApplicantDetails';
import KycAuditTimeline from './KycAuditTimeline';
import { Applicant } from './types';

export default function SuperAdminKycView() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>('#9821-V');

  const selectedApplicant =
    applicants.find((app) => app.id === selectedApplicantId) || applicants[0];

  const handleApprove = (id: string) => {
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
                  desc: `Rahat Mahmud approved driver credentials and verified ICU ambulance (${app.licensePlate}).`,
                  time: 'Just now',
                  status: 'SUCCESS',
                },
              ],
            }
          : app,
      ),
    );
    toast.success(
      `Driver & Vehicle approved! ${selectedApplicant.name} (${selectedApplicant.driverId}) is now active on the dispatch network.`,
    );
  };

  const handleReject = (id: string, reason: string) => {
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
                  desc: `Rejected by Rahat Mahmud. Reason: ${reason}`,
                  time: 'Just now',
                  status: 'IN_PROGRESS',
                },
              ],
            }
          : app,
      ),
    );
    toast.error(`Application rejected for ${selectedApplicant.name}. Rejection notice dispatched.`);
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
          Review Bangladesh Road Transport Authority (BRTA) driving licenses, NID credentials,
          and emergency ambulance fleet compliance.
        </p>
      </div>

      {/* Main 2-Pane / 3-Column Verification Workspace */}
      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Left Pane: Verification Queue (w-full lg:w-96 shrink-0) */}
        <div className="w-full lg:w-96 shrink-0">
          <KycQueueList
            applicants={applicants}
            selectedApplicantId={selectedApplicantId}
            onSelectApplicant={setSelectedApplicantId}
          />
        </div>

        {/* Right Pane: Applicant Details, Documents & Audit Trail (flex-1) */}
        <div className="flex-1 w-full space-y-6">
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

