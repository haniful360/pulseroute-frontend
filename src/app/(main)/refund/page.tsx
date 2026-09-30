import React from 'react';
import type { Metadata } from 'next';
import LegalPageLayout, { TocSection } from '@/components/main/Legal/LegalPageLayout';
import {
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Wallet,
  Ambulance,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy & Billing Guarantee — PulseRoute',
  description:
    'Transparent, patient-centric refund and cancellation guidelines for PulseRoute emergency ambulance dispatches, delay protections, and digital payment disputes.',
};

const SECTIONS: TocSection[] = [
  { id: 'principles', title: '1. Billing & Refund Principles' },
  { id: 'matrix', title: '2. Refund Eligibility Matrix' },
  { id: 'arrival-guarantee', title: '3. Arrival & Delay Guarantee' },
  { id: 'erroneous-charges', title: '4. Duplicate & Billing Corrections' },
  { id: 'breakdown-policy', title: '5. Vehicle Breakdown Protection' },
  { id: 'timelines', title: '6. Processing Channels & Timelines' },
  { id: 'how-to-claim', title: '7. How to Request a Refund' },
  { id: 'non-refundable', title: '8. Non-Refundable Items' },
  { id: 'scheduled-transfers', title: '9. Scheduled Inter-Hospital Trips' },
  { id: 'contact', title: '10. Billing Support & Grievances' },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy & Transparent Billing Guarantee"
      subtitle="During a medical emergency, families deserve compassion and complete financial transparency. We ensure transparent pricing, structured cancellation rights, and rapid digital refund processing."
      lastUpdated="September 30, 2026"
      version="2.2"
      badge="Transparent Emergency Billing Guarantee"
      badgeIcon={<RefreshCw className="h-3.5 w-3.5 text-red-500" />}
      sections={SECTIONS}
    >
      {/* 1. Principles */}
      <section id="principles" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Fair Emergency Billing Principles
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute was founded on the fundamental principle that no family should negotiate fares while a life is on the line. When services cannot be delivered according to our verified standards, or when clinical circumstances necessitate trip cancellation, our refund protocols are designed to be immediate, equitable, and transparent.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Zero Hidden Surcharges</p>
            <p className="text-slate-600 leading-relaxed">
              Every fare calculation is programmatic and itemized. You will never be charged for unapproved ancillary fees.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Pro-Patient Triage Benefit</p>
            <p className="text-slate-600 leading-relaxed">
              In cases where ambulance arrival is no longer needed due to rapid on-scene recovery, cancellation grace periods protect family funds.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Telemetry-Backed Audits</p>
            <p className="text-slate-600 leading-relaxed">
              All dispute claims are verified objectively using immutable GPS telemetry records, timestamped pings, and dispatch logs.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 2. Refund Eligibility Matrix */}
      <section id="matrix" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Cancellation Windows &amp; Refund Eligibility Matrix
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          The following table outlines refund entitlements based on the exact dispatch lifecycle stage at the moment of cancellation:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 font-bold text-slate-700">
              <tr>
                <th className="p-3.5">Cancellation Scenario</th>
                <th className="p-3.5">Refund Percentage</th>
                <th className="p-3.5">Fee Retained / Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="bg-emerald-50/30">
                <td className="p-3.5 font-medium text-slate-900">
                  Within 3 minutes of dispatch booking, before vehicle mobilization
                </td>
                <td className="p-3.5 font-bold text-emerald-600">100% Full Refund</td>
                <td className="p-3.5 text-slate-500">BDT 0 (Zero penalty)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-slate-900">
                  After 3 minutes, while ambulance is actively en route
                </td>
                <td className="p-3.5 font-bold text-slate-800">Partial Refund (80%)</td>
                <td className="p-3.5 text-slate-500">BDT 300 - 500 (Crew fuel/mobilization fee)</td>
              </tr>
              <tr className="bg-amber-50/30">
                <td className="p-3.5 font-medium text-slate-900">
                  Ambulance has arrived at patient pickup location and waited &gt;15 min grace
                </td>
                <td className="p-3.5 font-bold text-amber-700">Partial Refund (50%)</td>
                <td className="p-3.5 text-slate-500">Base mobilization charge (distance fare refunded)</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="p-3.5 font-medium text-slate-900">
                  Severe Crew Delay (&gt; 15 minutes past verified initial ETA)
                </td>
                <td className="p-3.5 font-bold text-emerald-600">100% Full Refund</td>
                <td className="p-3.5 text-slate-500">BDT 0 + Free backup dispatch priority</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="p-3.5 font-medium text-slate-900">
                  Vehicle technical breakdown or medical equipment malfunction
                </td>
                <td className="p-3.5 font-bold text-emerald-600">100% Full Refund</td>
                <td className="p-3.5 text-slate-500">BDT 0 + Instant free replacement vehicle</td>
              </tr>
              <tr className="bg-red-50/30">
                <td className="p-3.5 font-medium text-slate-900">
                  Hoax / Malicious dispatch or bystander violent refusal
                </td>
                <td className="p-3.5 font-bold text-red-600">0% (Non-refundable)</td>
                <td className="p-3.5 text-slate-500">Full base fare retained + Account review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 3. Arrival Guarantee */}
      <section id="arrival-guarantee" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            PulseRoute Arrival &amp; Delay Guarantee
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          We pride ourselves on our sub-seven-minute rapid emergency response. If an assigned vehicle experiences an unanticipated delay exceeding <strong>15 minutes past the confirmed ETA</strong> due to non-force-majeure causes:
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Ambulance className="h-4 w-4 text-red-600" />
            <span>Dual-Option Arrival Guarantee</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            1. <strong>Cancel with Full 100% Refund:</strong> You may cancel with a single tap in the active trip screen without incurring any fees.
          </p>
          <p className="text-slate-600 leading-relaxed">
            2. <strong>Instant Alternative Reroute:</strong> Our Automated Command Desk will immediately re-assign a closer standby unit to your location with priority siren privileges at zero additional surcharge.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 4. Erroneous Charges */}
      <section id="erroneous-charges" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Duplicate &amp; Billing Corrections
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          In the event of network connectivity interruptions during payment, system double-deductions, or gateway timeouts:
        </p>

        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong>Automated Reconciliation:</strong> Our financial clearing engines run automated audit sweeps every 4 hours. Any detected duplicate authorizations on the same trip ID are automatically flagged and queued for instant reversal without requiring user intervention.
          </p>
          <p>
            <strong>Fare Discrepancies:</strong> If an en route toll was erroneously billed twice, or if the calculated mileage exceeds the actual telemetry path, submit a one-click review request in your Trip History. Adjustments are issued within 24 hours.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 5. Breakdown Policy */}
      <section id="breakdown-policy" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            5
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Vehicle Breakdown &amp; Equipment Malfunction
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Though all fleet ambulances undergo rigorous bi-weekly mechanical and sanitary audits, unpredictable mechanical breakdowns can occur:
        </p>

        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-2 text-xs text-red-950">
          <div className="flex items-center gap-2 font-bold text-red-900">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Emergency Protocol Code-Amber</span>
          </div>
          <p className="leading-relaxed">
            If an ambulance experiences a flat tire, engine stoppage, or medical equipment glitch during patient transport, our command desk instantly reroutes the nearest available vehicle to execute a roadside or mid-route clinical transfer. 
          </p>
          <p className="font-semibold text-red-700">
            The original trip fare is 100% refunded to the patient, and the backup transit is provided at zero additional cost.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 6. Timelines */}
      <section id="timelines" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            6
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Processing Channels &amp; Settlement Timelines
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Once an eligible refund is authorized by our system or confirmed by our compliance desk, funds are credited based on the original payment method:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span>PulseRoute Wallet</span>
            </div>
            <p className="text-emerald-700 font-bold">Instant (0 - 5 Minutes)</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Immediate credit available for future emergency rides, hospital bookings, or direct bank cash-out.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span>Mobile Financial Services</span>
            </div>
            <p className="text-blue-700 font-bold">24 - 48 Hours</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Direct reversal to bKash, Nagad, or Rocket account via automated MFS merchant gateway reversal.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span>Credit &amp; Debit Cards</span>
            </div>
            <p className="text-purple-700 font-bold">5 - 7 Business Days</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Processed through Stripe / acquiring bank; timeline governed by standard card issuer clearance cycles.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 7. How to Claim */}
      <section id="how-to-claim" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            7
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            How to File a Refund Request
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Requesting a refund or fare adjustment takes less than two minutes:
        </p>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900">Through your Patient Dashboard</p>
              <p className="text-slate-500">Go to <strong>Trip History</strong> &rarr; Select the relevant Trip &rarr; Click <strong>Report Billing Issue / Request Refund</strong>.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
              2
            </span>
            <div>
              <p className="font-bold text-slate-900">Directly via 24/7 Command Hotline</p>
              <p className="text-slate-500">Call <strong>999</strong> or our dispatch support line. Quote your Trip ID or phone number, and our coordinator will initiate immediate review.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
              3
            </span>
            <div>
              <p className="font-bold text-slate-900">Via Dedicated Billing Email</p>
              <p className="text-slate-500">Send your invoice copy to <strong>billing@pulseroute.com</strong>. You will receive an automated ticket acknowledgement in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 8. Non-Refundable Items */}
      <section id="non-refundable" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            8
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Non-Refundable Items &amp; Consumables
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          The following components are strictly non-refundable once administered or deployed:
        </p>

        <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Single-Use Medical Consumables:</strong> Sterile surgical bandages, IV cannulas, disposable oxygen masks, and specific emergency medication vials unsealed for the patient.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Authorized Extended Waiting Time:</strong> Standby hours specifically requested in writing by the attending family (past the included 15-minute free triage loading period).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Completed Safe Dispatches:</strong> Trips where the patient was successfully transported to the target hospital without incident.</span>
          </li>
        </ul>
      </section>

      <hr className="border-slate-100" />

      {/* 9. Scheduled Transfers */}
      <section id="scheduled-transfers" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            9
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Scheduled Inter-Hospital Transfer Policies
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          For pre-booked non-emergency hospital transfers, dialysis shuttles, or scheduled post-operative journeys:
        </p>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white text-xs">
          <div className="p-3.5 flex items-center justify-between">
            <span className="font-medium text-slate-900">Cancelled &gt; 2 Hours Before Scheduled Time</span>
            <span className="font-bold text-emerald-600">100% Full Refund</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="font-medium text-slate-900">Cancelled 1 to 2 Hours Before Scheduled Time</span>
            <span className="font-bold text-slate-800">85% Refund (15% reservation fee)</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="font-medium text-slate-900">Cancelled &lt; 1 Hour Before Scheduled Time</span>
            <span className="font-bold text-amber-700">70% Refund (30% crew mobilization fee)</span>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 10. Contact */}
      <section id="contact" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            10
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Billing Support &amp; Grievances Desk
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Our financial audit and grievance team is on standby 24/7 to guarantee every fare is fair and equitable:
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-sm text-slate-900">PulseRoute Financial Grievance Directorate</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 font-medium">
            <a href="mailto:billing@pulseroute.com" className="flex items-center gap-1.5 text-red-600 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              <span>billing@pulseroute.com</span>
            </a>
            <a href="tel:999" className="flex items-center gap-1.5 text-slate-700 hover:underline">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>24/7 Hotline: 999</span>
            </a>
          </div>
          <p className="text-slate-500 pt-1 text-[11px]">Dhaka Metro Command Hub, Road 11, Banani, Dhaka 1213, Bangladesh</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
