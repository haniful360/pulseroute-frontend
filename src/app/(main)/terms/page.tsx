import React from 'react';
import type { Metadata } from 'next';
import LegalPageLayout, { TocSection } from '@/components/main/Legal/LegalPageLayout';
import {
  FileText,
  Scale,
  Ambulance,
  HeartPulse,
  AlertTriangle,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Dispatch Agreement — PulseRoute',
  description:
    'Read the official Terms of Service governing the use of PulseRoute emergency dispatch network, vehicle bookings, paramedic care, and platform rules.',
  keywords: [
    'PulseRoute terms of service',
    'Emergency medical service terms',
    'Ambulance booking agreement',
    'Patient transport terms Bangladesh',
  ],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service & Dispatch Agreement — PulseRoute',
    description:
      'Official terms governing emergency vehicle requests, paramedic response protocols, driver certifications, and digital fare settlements.',
    url: '/terms',
    siteName: 'PulseRoute',
    type: 'article',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Terms of Service and Dispatch Agreement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service & Dispatch Agreement — PulseRoute',
    description:
      'Official terms governing emergency vehicle requests, paramedic response protocols, driver certifications, and digital fare settlements.',
    images: ['/images/hero-map.png'],
  },
};

const SECTIONS: TocSection[] = [
  { id: 'acceptance', title: '1. Acceptance & Service Scope' },
  { id: 'eligibility', title: '2. Eligibility & Accounts' },
  { id: 'dispatch-allocation', title: '3. Dispatch & Vehicle Allocation' },
  { id: 'clinical-responsibilities', title: '4. Paramedic Care & Medical Scope' },
  { id: 'fleet-standards', title: '5. Vehicle & Equipment Standards' },
  { id: 'fare-structure', title: '6. Fares & Payment Terms' },
  { id: 'cancellation-rules', title: '7. Cancellations & Standby Rules' },
  { id: 'liability-limitations', title: '8. Liability & Force Majeure' },
  { id: 'prohibited-conduct', title: '9. Platform Misuse & False Alarms' },
  { id: 'governing-law', title: '10. Governing Law & Dispute Resolution' },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service & Dispatch Agreement"
      subtitle="Please review these legally binding terms governing emergency vehicle requests, paramedic response protocols, driver certifications, and digital fare settlements across the PulseRoute network."
      lastUpdated="September 30, 2026"
      version="3.1"
      badge="Emergency Medical Logistics Agreement"
      badgeIcon={<Scale className="h-3.5 w-3.5 text-red-500" />}
      sections={SECTIONS}
    >
      {/* 1. Acceptance & Scope */}
      <section id="acceptance" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Acceptance of Terms &amp; Platform Definition
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          By accessing or utilizing the PulseRoute website, mobile application, telemetry gateway, or emergency call-in dispatch desk (&quot;Services&quot;), you acknowledge that you have read, understood, and agree to be bound by this Agreement.
        </p>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute operates as a real-time emergency technology coordinator connecting patients, healthcare facilities, certified paramedic crews, and verified ambulance fleet operators. PulseRoute guarantees that all onboarded ambulances comply with BRTA regulations and Ministry of Health sanitation and equipment guidelines.
        </p>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Emergency Priority Directive</span>
          </div>
          If a patient is experiencing sudden cardiac arrest, massive hemorrhage, severe respiratory failure, or imminent death, the requester is urged to call <strong>999</strong> directly while simultaneously deploying our digital dispatch radar to mobilize the nearest crew without delay.
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 2. Eligibility & Accounts */}
      <section id="eligibility" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            User Eligibility &amp; Account Obligations
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          You must be at least 18 years old or possess legal capacity under Bangladesh law to create a primary booking account. However, any individual (including minors or bystanders) may request an emergency dispatch on behalf of an incapacitated or injured patient under emergency good-samaritan provisions.
        </p>

        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Accurate Contact Information:</strong> Requesters must provide an operable, active phone number so the approaching paramedic crew can confirm landmark specifics.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Triage Honesty:</strong> Requesters must faithfully state whether infectious diseases, violent trauma, or life-support needs are present to ensure appropriate vehicle tier assignment.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Driver Credentialing:</strong> Driver and paramedic partners must maintain active heavy/professional driving licenses and complete periodic background verification (KYC).</span>
          </li>
        </ul>
      </section>

      <hr className="border-slate-100" />

      {/* 3. Dispatch & Vehicle Allocation */}
      <section id="dispatch-allocation" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Dispatch Algorithm &amp; Vehicle Allocation
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute utilizes an automated proximity and capability dispatch algorithm. When a request is submitted:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Closest-Qualified Match</p>
            <p className="text-slate-600 leading-relaxed">
              Dispatch is routed to the nearest accredited ambulance equipped for the requested tier (e.g. ICU ventilator for respiratory distress).
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-1">
            <p className="font-bold text-slate-900">Dynamic Siren-Corridor Routing</p>
            <p className="text-slate-600 leading-relaxed">
              Navigation models incorporate live municipal traffic congestion, bridge toll lanes, and construction blockages to compute the optimal route.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          *Note: While PulseRoute ambulances are emergency vehicles with siren privileges, municipal traffic gridlock, train crossings, natural inundation, or public demonstrations may occasionally impact estimated arrival times.
        </p>
      </section>

      <hr className="border-slate-100" />

      {/* 4. Paramedic Care */}
      <section id="clinical-responsibilities" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Paramedic Care &amp; Medical Scope
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Paramedics and emergency medical technicians operating within the PulseRoute network provide pre-hospital life support, stabilization, and patient monitoring during transit:
        </p>

        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong>Pre-Hospital Stabilization:</strong> Onboard clinical personnel are authorized to administer supplemental oxygen, basic hemorrhage control, splinting, vital sign monitoring, and AED deployment in accordance with their professional scope of practice.
          </p>
          <p>
            <strong>Right to Refuse Dangerous Transport:</strong> Ambulance crews reserve the right to decline or suspend transport if patient guardians or bystanders exhibit violent behavior, brandish weapons, or mandate actions contrary to patient survival guidelines.
          </p>
          <p>
            <strong>Hospital Selection:</strong> Unless the patient or legal guardian designates a specific facility, the crew will transport the patient to the nearest accredited tertiary hospital equipped for the evaluated medical emergency.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 5. Fleet Standards */}
      <section id="fleet-standards" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            5
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Vehicle &amp; Equipment Standards
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          PulseRoute classifies ambulances into strict standardized operational tiers. Every vehicle must undergo periodic physical audits:
        </p>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white text-xs">
          <div className="p-3.5">
            <span className="font-bold text-slate-900">Standard AC Ambulance:</span>
            <span className="text-slate-600 ml-2">Dual air conditioning, collapsible stretcher, primary oxygen cylinder, first aid trauma kit, IV stand.</span>
          </div>
          <div className="p-3.5">
            <span className="font-bold text-slate-900">ICU / CCU Life Support Unit:</span>
            <span className="text-slate-600 ml-2">Portable transport ventilator, multi-parameter cardiac monitor, suction machine, defibrillator, emergency drug supply.</span>
          </div>
          <div className="p-3.5">
            <span className="font-bold text-slate-900">NICU / Neonatal Transport:</span>
            <span className="text-slate-600 ml-2">Self-contained neonatal transport incubator, infant oxygen delivery system, specialized thermal regulators.</span>
          </div>
          <div className="p-3.5">
            <span className="font-bold text-slate-900">Freezer Mortuary Vehicle:</span>
            <span className="text-slate-600 ml-2">Hermetically sealed temperature-controlled refrigeration unit maintaining constant sub-zero preserves.</span>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 6. Fares & Payments */}
      <section id="fare-structure" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            6
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Fares, Surcharges &amp; Payment Terms
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          No family should negotiate fares during an emergency. PulseRoute enforces programmatic, upfront pricing:
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>Programmatic Fare Formula</span>
            <span className="font-mono text-red-600">Base Fare + (Distance Rate × KM) + Tier Factor</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All trip fares are displayed transparently prior to confirmation. Additional legitimate charges may include bridge/expressway toll charges, authorized disposable medication kits, or extended standby wait-time requested by the family.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Payment may be remitted via digital debit/credit cards (Stripe-processed), mobile financial services (bKash/Nagad), PulseRoute Wallet, or pre-authorized hospital corporate billing accounts.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 7. Cancellations */}
      <section id="cancellation-rules" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            7
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Cancellations &amp; Standby Rules
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Because deploying an ambulance mobilizes life-saving equipment away from other patients in the city, cancellations are governed by structured guidelines (detailed fully in our Refund Policy):
        </p>

        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <span><strong>Immediate Free Cancellation:</strong> Within 3 minutes of initial booking or before vehicle mobilization begins.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <span><strong>En Route Mobilization Fee:</strong> If cancelled after 3 minutes while the ambulance is actively en route, a nominal fuel/mobilization fee is retained.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <span><strong>Grace Standby Period:</strong> Ample 15 minutes of free patient stabilization/loading time is included at the pickup location before per-minute standby charges apply.</span>
          </li>
        </ul>
      </section>

      <hr className="border-slate-100" />

      {/* 8. Limitation of Liability */}
      <section id="liability-limitations" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            8
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Limitation of Liability &amp; Force Majeure
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          To the maximum extent permitted by applicable law:
        </p>

        <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Unforeseeable Delays:</strong> PulseRoute and its driver partners shall not be held liable for delayed arrival caused by catastrophic weather events, municipal bridge closures, civil curfews, cellular network outages, or unyielding road traffic congestion beyond human control.
          </p>
          <p>
            <strong>Medical Outcomes:</strong> While our accredited crews exert clinical best efforts, pre-hospital transport does not substitute for definitive hospital surgery or intensive care. PulseRoute does not guarantee medical outcomes or recovery from pre-existing trauma or illnesses.
          </p>
          <p>
            <strong>Monetary Liability Cap:</strong> PulseRoute&apos;s aggregate liability for any direct dispute arising from a dispatch shall not exceed the total fare paid for that specific trip.
          </p>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 9. Prohibited Conduct */}
      <section id="prohibited-conduct" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            9
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Platform Misuse &amp; False Alarms
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Dispatching an emergency ambulance is a life-critical matter. The following actions constitute immediate grounds for account ban and legal referral:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-1">
            <p className="font-bold text-red-900">Hoax &amp; False Dispatch Requests</p>
            <p className="text-red-800/80 leading-relaxed">
              Summoning emergency vehicles to fictitious locations or for pranks is reported immediately to cyber police under the Penal Code and Digital Security Act.
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-1">
            <p className="font-bold text-red-900">Crew Harassment &amp; Physical Threat</p>
            <p className="text-red-800/80 leading-relaxed">
              Verbal abuse, intimidation, or physical hindrance of paramedics performing their duties will result in law enforcement intervention.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 10. Governing Law */}
      <section id="governing-law" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-sm">
            10
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Governing Law &amp; Dispute Resolution
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          These Terms of Service are governed by and construed in accordance with the substantive laws of the People&apos;s Republic of Bangladesh.
        </p>

        <p className="text-xs text-slate-600 leading-relaxed">
          Any controversy or claim arising out of or relating to this agreement shall be settled through good-faith mutual mediation. If unresolved within thirty (30) days, the dispute shall be submitted to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-sm text-slate-900">PulseRoute Legal &amp; Compliance Directorate</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 font-medium">
            <a href="mailto:legal@pulseroute.com" className="flex items-center gap-1.5 text-red-600 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              <span>legal@pulseroute.com</span>
            </a>
            <a href="tel:999" className="flex items-center gap-1.5 text-slate-700 hover:underline">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>24/7 Operations Desk: 999</span>
            </a>
          </div>
          <p className="text-slate-500 pt-1 text-[11px]">Dhaka Metro Command Hub, Road 11, Banani, Dhaka 1213, Bangladesh</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
