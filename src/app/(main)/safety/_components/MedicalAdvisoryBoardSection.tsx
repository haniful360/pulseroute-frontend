import React from 'react';
import { FaLinkedin } from 'react-icons/fa6';

interface AdvisoryMember {
  initials: string;
  name: string;
  degrees: string;
  role: string;
  linkedinUrl: string;
}

const ADVISORY_BOARD: AdvisoryMember[] = [
  {
    initials: 'AH',
    name: 'Prof. Dr. Anwar Hossain',
    degrees: 'MBBS, FCPS (Cardiology)',
    role: 'Chair, Medical Advisory Board',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    initials: 'SA',
    name: 'Dr. Shirin Akter',
    degrees: 'MBBS, MD (Neonatology)',
    role: 'Neonatal Transport Protocols',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    initials: 'RK',
    name: 'Dr. Rezaul Karim',
    degrees: 'MBBS, MCEM (Emergency Medicine)',
    role: 'Dispatch Triage Standards',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    initials: 'SC',
    name: 'Sabrina Chowdhury',
    degrees: 'RN, ACLS Instructor',
    role: 'Head of Paramedic Training',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    initials: 'IR',
    name: 'Dr. Imtiaz Rahman',
    degrees: 'MBBS, MPH',
    role: 'Infection Control & Sanitisation',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    initials: 'KA',
    name: 'Kazi Nazmul Alam',
    degrees: 'MSc, Transport Safety',
    role: 'Fleet Fitness & Compliance',
    linkedinUrl: 'https://linkedin.com',
  },
];

export const MedicalAdvisoryBoardSection: React.FC = () => {
  return (
    <section className="bg-[#F8FAFC]/70 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Medical Advisory Board
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Clinicians who write and audit our triage, transport and sanitisation protocols.
          </p>
        </div>

        {/* 6 Clinician Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {ADVISORY_BOARD.map((member) => (
            <div
              key={member.name}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              {/* Initials Avatar */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-950 font-bold tracking-wider text-white shadow-xs">
                <span className="text-base">{member.initials}</span>
              </div>

              {/* Details & LinkedIn */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-slate-500">{member.degrees}</p>
                <p className="mt-1 text-xs font-semibold text-slate-700">{member.role}</p>

                {/* Red LinkedIn CTA */}
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  <FaLinkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
