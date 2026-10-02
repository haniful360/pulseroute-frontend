'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  RefreshCw,
  Phone,
  Mail,
  Printer,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface TocSection {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  version: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  sections: TocSection[];
  children: React.ReactNode;
}

const LEGAL_NAV_ITEMS = [
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'Patient medical data, HIPAA/GDPR standards, GPS telemetry',
    icon: ShieldCheck,
  },
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'Service parameters, dispatch allocation, passenger terms',
    icon: FileText,
  },
  {
    title: 'Refund Policy',
    href: '/refund',
    description: 'Cancellation timelines, arrival guarantees, billing disputes',
    icon: RefreshCw,
  },
];

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  version,
  badge,
  badgeIcon,
  sections,
  children,
}) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-950 py-16 sm:py-20 lg:py-24 text-white">
        {/* Subtle decorative grid and radial lights */}
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#e63946_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-red-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold tracking-wider text-red-400 uppercase">
              {badgeIcon || <ShieldCheck className="h-3.5 w-3.5 text-red-500" />}
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl text-white">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              {subtitle}
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5">
                <Clock className="h-3.5 w-3.5 text-red-400" />
                Last Updated: {lastUpdated}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Version {version} • Legally Enforceable
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 transition-colors hover:border-slate-700 hover:text-white cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-400" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Document Switcher Navigation Bar (Desktop & Mobile) */}
      <nav aria-label="Legal document categories" className="sticky top-16 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 custom-scrollbar">
            {LEGAL_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. Main Content Grid (Sticky TOC on Left, Document Body on Right) */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Sticky Table of Contents & Support Box */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Table of Contents Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    On This Page
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {sections.length} Sections
                  </span>
                </div>

                <nav className="mt-4 space-y-1">
                  {sections.map((sec, idx) => {
                    const isSecActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(sec.id);
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                            setActiveSection(sec.id);
                          }
                        }}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                          isSecActive
                            ? 'bg-red-50 text-red-600 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] ${
                              isSecActive
                                ? 'bg-red-600 text-white font-bold'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </span>
                        <ChevronRight
                          className={`h-3 w-3 shrink-0 transition-transform ${
                            isSecActive ? 'text-red-600' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Emergency Hotline & Legal Desk Help Card */}
              <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50/80 via-white to-red-50/40 p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm shadow-red-600/30">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Emergency Dispatch Desk</h2>
                    <p className="text-[11px] font-medium text-slate-500">24/7 Operations Command</p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  For immediate ambulance assistance, hospital coordination, or live trip billing emergency:
                </p>

                <div className="mt-3.5 space-y-2">
                  <a
                    href="tel:999"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call 24/7 Hotline: 999</span>
                  </a>
                  <a
                    href="mailto:legal@pulseroute.com"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>legal@pulseroute.com</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Document Content */}
          <section className="lg:col-span-8">
            <div className="space-y-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LegalPageLayout;
