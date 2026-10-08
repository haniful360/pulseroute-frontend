import React from 'react';
import type { Metadata } from 'next';
import LegalPageLayout, { TocSection } from '@/components/main/Legal/LegalPageLayout';
import {
  ShieldCheck,
  Lock,
  HeartPulse,
  Navigation,
  FileText,
  AlertTriangle,
  Server,
  Eye,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Medical Data Protection — PulseRoute',
  description:
    'Learn how PulseRoute safeguards patient medical records, live emergency telemetry, paramedic communications, and personal data across Bangladesh.',
  keywords: [
    'PulseRoute privacy policy',
    'Medical data privacy Bangladesh',
    'Patient records protection',
    'Emergency telemetry encryption',
  ],
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Medical Data Protection — PulseRoute',
    description:
      'PulseRoute data privacy architecture: end-to-end telemetry encryption, strict medical record access control, and compliance.',
    url: '/privacy',
    siteName: 'PulseRoute',
    type: 'article',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Privacy Policy and Medical Data Protection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Medical Data Protection — PulseRoute',
    description:
      'PulseRoute data privacy architecture: end-to-end telemetry encryption, strict medical record access control, and compliance.',
    images: ['/images/hero-map.png'],
  },
};

const SECTIONS: TocSection[] = [
  { id: 'intro', title: '1. Introduction & Scope' },
  { id: 'collection', title: '2. Information We Collect' },
  { id: 'use', title: '3. Purpose of Processing' },
  { id: 'gps-telemetry', title: '4. GPS & Real-Time Telemetry' },
  { id: 'clinical-data', title: '5. Medical & Health Privacy' },
  { id: 'sharing', title: '6. Authorized Third Parties' },
  { id: 'security', title: '7. Encryption & Security' },
  { id: 'retention', title: '8. Data Retention Policies' },
  { id: 'rights', title: '9. Your Privacy Rights' },
  { id: 'contact', title: '10. Data Protection Officer' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy & Medical Data Protection"
      subtitle="At PulseRoute, we operate at the intersection of life-saving emergency medical logistics and highly confidential health telemetry. Here is our unwavering commitment to protecting your privacy."
      lastUpdated="September 30, 2026"
      version="2.4"
      badge="Data Protection & HIPAA-Aligned Governance"
      badgeIcon={<Lock className="h-3.5 w-3.5 text-red-500" />}
      sections={SECTIONS}
    >
      {/* 1. Introduction */}
      <section id="intro" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Introduction &amp; Scope
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute Emergency Medical Dispatch Network (&quot;PulseRoute&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to preserving the confidentiality, integrity, and security of all personal, technical, and protected health information (PHI) collected through our web platforms, mobile dispatch applications, automated telemetry gateways, and 24/7 emergency hotline integrations.
        </p>

        <p className="text-sm leading-relaxed text-slate-600">
          This Privacy Policy applies to all patients requesting emergency transport, accompanying family members, licensed paramedic crew members, ambulance fleet owners, emergency hospital intake staff, and visitors browsing our public portal across our active operational cities in Bangladesh.
        </p>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-blue-900">
          <div className="flex items-center gap-2 font-bold text-blue-950 mb-1">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Healthcare Confidentiality Alignment</span>
          </div>
          PulseRoute is engineered in accordance with international medical privacy standards (including key tenets of HIPAA Security Rule for electronic health records) and local regulatory frameworks including the Bangladesh Digital Security Act and medical record keeping mandates.
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 2. Information We Collect */}
      <section id="collection" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Information We Collect
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          To dispatch emergency medical vehicles in under seven minutes and deliver verified clinical care on wheels, we collect specific data categories proportionate to the urgency of medical transport:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Patient &amp; Guardian Profile
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full legal name, authenticated mobile phone number, primary residence address, blood group, emergency contact relation, and government identity document (when verifying patient profiles).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Clinical Triage &amp; Medical Intake
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Critical medical pre-conditions, known drug allergies, mobility status (stretcher/wheelchair), oxygen dependency requirements, and preliminary triage notes reported during dispatch initiation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Real-Time Location &amp; Routing
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exact latitude/longitude coordinates of the emergency incident, target destination hospital, and continuous real-time GPS telemetry of dispatched ambulances throughout transit.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Paramedic Crew &amp; Vehicle Records
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Professional heavy driver license, BRTA vehicle registration, medical technician certification, national identity (NID), real-time duty status, and in-cabin telemetry logs.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 3. Purpose of Processing */}
      <section id="use" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Purpose of Processing
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute does NOT sell, rent, monetize, or trade patient personal or clinical information under any circumstances. We process your data exclusively for the following operational necessities:
        </p>

        <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span><strong>Emergency Vehicle Dispatch:</strong> Matching the patient with the nearest accredited ambulance tier (Basic, AC, ICU, NICU, CCU) based on triage telemetry.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span><strong>Hospital Emergency Pre-Notification:</strong> Transmitting essential triage data and estimated time of arrival (ETA) to the receiving hospital trauma room prior to patient arrival.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span><strong>Paramedic Clinical Preparedness:</strong> Equipping the attending paramedic crew with patient vital alerts (e.g. cardiac history, oxygen level expectations) before arrival on scene.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span><strong>Billing, Invoicing &amp; Insurance:</strong> Calculating standardized transparent trip receipts, processing digital payments, and supplying itemized invoices for health insurance claims.</span>
          </li>
        </ul>
      </section>

      <hr className="border-slate-100" />

      {/* 4. GPS & Real-Time Telemetry */}
      <section id="gps-telemetry" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            GPS &amp; Real-Time Telemetry
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Location data is the cornerstone of our rapid emergency response infrastructure. We treat geo-telemetry with surgical privacy boundaries:
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
            <Navigation className="h-4 w-4 text-red-600" />
            <span>Strict Temporal Location Window</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Patient location tracking begins exclusively upon manual confirmation of an ambulance booking, remains active throughout the vehicle transit phase, and <strong>automatically terminates immediately upon confirmed hospital arrival or trip completion</strong>. PulseRoute does not track passenger location outside an active dispatch lifecycle.
          </p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          For driver partners, background location tracking operates solely while the crew status is toggled to &quot;ONLINE&quot; or &quot;ON_TRIP&quot; within the Dispatch Radar to calculate citywide fleet coverage and allocate emergency calls. When toggled &quot;OFFLINE&quot;, location polling ceases completely.
        </p>
      </section>

      <hr className="border-slate-100" />

      {/* 5. Medical & Health Privacy */}
      <section id="clinical-data" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            5
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Medical &amp; Health Privacy
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Any health condition, medical document, blood group disclosure, or doctor note provided in your Medical Profile or during dispatch triage is classified as Sensitive Protected Health Information:
        </p>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span><strong>Role-Based Cryptographic Access:</strong> Drivers and paramedics can only view triage data pertinent to the current active transport. They cannot access past medical records or unrelated personal files.</span>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span><strong>Crew Confidentiality Covenants:</strong> All drivers and paramedics sign legally binding non-disclosure agreements regarding patient identity, conditions, and incident locations.</span>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span><strong>No Marketing Retargeting:</strong> Medical conditions are never used for advertising, behavioral retargeting, or algorithmic profiling.</span>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 6. Authorized Third Parties */}
      <section id="sharing" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            6
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Authorized Third Parties
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute shares selected data strictly on a need-to-know basis with the following verified entities to fulfill emergency life-support operations:
        </p>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white text-xs">
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">Hospital Emergency Triage Teams</p>
              <p className="text-slate-500 text-[11px]">Receiving hospital doctors &amp; trauma coordinators</p>
            </div>
            <span className="font-mono text-slate-700 font-medium">Patient Vitals, ETA &amp; Triage Data</span>
          </div>
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">Assigned Paramedic &amp; Ambulance Crew</p>
              <p className="text-slate-500 text-[11px]">En route vehicle emergency team</p>
            </div>
            <span className="font-mono text-slate-700 font-medium">Pickup Landmark &amp; Incident Notes</span>
          </div>
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">National Emergency Services (999)</p>
              <p className="text-slate-500 text-[11px]">Government emergency dispatch link (when requested)</p>
            </div>
            <span className="font-mono text-slate-700 font-medium">Incident Location &amp; Priority Code</span>
          </div>
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">Payment Gateways (Stripe, SSLCommerz, MFS)</p>
              <p className="text-slate-500 text-[11px]">PCI-DSS Level 1 certified processors</p>
            </div>
            <span className="font-mono text-slate-700 font-medium">Tokenized Billing IDs (No Raw Cards)</span>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 7. Security Architecture */}
      <section id="security" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            7
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Encryption &amp; Security Architecture
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute maintains an enterprise-grade defense-in-depth security infrastructure designed specifically for high-availability emergency systems:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">In-Transit Encryption</p>
            <p className="text-slate-600 leading-relaxed">
              Every API request, telemetry ping, and socket message uses TLS 1.3 protocol with forward secrecy.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Resting Data Protection</p>
            <p className="text-slate-600 leading-relaxed">
              Primary databases and Cloudinary document vaults are protected with hardware-managed AES-256 keys.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Isolated Audit Trails</p>
            <p className="text-slate-600 leading-relaxed">
              Every data access request by staff is logged immutably with timestamp, operator ID, and rationale.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 8. Data Retention */}
      <section id="retention" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            8
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Data Retention Policies
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Different data types follow specialized retention lifecycles to balance clinical utility, billing reconciliation, and privacy minimization:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-100/80 font-bold text-slate-700">
              <tr>
                <th className="p-3">Data Classification</th>
                <th className="p-3">Retention Window</th>
                <th className="p-3">Action at Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-medium text-slate-900">Continuous GPS Breadcrumb Pings</td>
                <td className="p-3">90 Days</td>
                <td className="p-3">Hard deleted; generalized trip polygon preserved</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Incident Triage &amp; Clinical Notes</td>
                <td className="p-3">3 Years (Statutory medical law)</td>
                <td className="p-3">Encrypted cold archive with restricted audit access</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Financial Invoices &amp; Receipts</td>
                <td className="p-3">7 Years (Tax &amp; accounting regulation)</td>
                <td className="p-3">Archived securely for revenue auditing</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Patient Emergency Contacts</td>
                <td className="p-3">Active account duration</td>
                <td className="p-3">Purged within 14 days of account closure request</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 9. Your Privacy Rights */}
      <section id="rights" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            9
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Your Privacy Rights
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Regardless of your physical city or account tier, you hold complete autonomy over your personal information:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1">
            <p className="font-bold text-slate-900">Right to Access &amp; Portability</p>
            <p className="text-slate-600">Download a full machine-readable JSON/CSV export of your dispatch history and medical profile from your dashboard settings.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1">
            <p className="font-bold text-slate-900">Right to Rectification</p>
            <p className="text-slate-600">Update incorrect blood group, emergency numbers, or guardian information instantly via your Patient Dashboard.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1">
            <p className="font-bold text-slate-900">Right to Erasure (&quot;Right to be Forgotten&quot;)</p>
            <p className="text-slate-600">Request complete account deletion, subject to mandatory medical-legal and tax records retention periods required by law.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1">
            <p className="font-bold text-slate-900">Right to Restrict Processing</p>
            <p className="text-slate-600">Opt out of non-essential analytical cookies and marketing SMS notifications while keeping emergency dispatches active.</p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 10. Contact Information */}
      <section id="contact" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            10
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Data Protection Officer &amp; Inquiries
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          If you have questions, concerns, or requests regarding this Privacy Policy or suspect any unauthorized access to your clinical or account data, contact our dedicated Data Protection Officer:
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-sm text-slate-900">Office of Data Governance &amp; Patient Privacy</p>
          <p>PulseRoute Technologies Ltd. • Emergency Dispatch Command Centre</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 font-medium">
            <a href="mailto:privacy@pulseroute.com" className="flex items-center gap-1.5 text-red-600 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              <span>privacy@pulseroute.com</span>
            </a>
            <a href="tel:999" className="flex items-center gap-1.5 text-slate-700 hover:underline">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>National Dispatch Hotline: 999</span>
            </a>
          </div>
          <p className="text-slate-500 pt-1 text-[11px]">Dhaka Metro Command Hub, Road 11, Banani, Dhaka 1213, Bangladesh</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
