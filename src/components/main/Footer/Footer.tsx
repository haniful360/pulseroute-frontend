'use client';

import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { Lock, Send } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F17] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-5 lg:col-span-4">
            <PulseRouteLogo isDark={true} />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Verified ambulances, dispatched in seconds. We exist so no family in Bangladesh
              negotiates a fare while a life is on the line.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-colors hover:bg-red-600 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#vehicles" className="transition-colors hover:text-white">
                  Ambulance Types
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-white">
                  Fare Estimator
                </Link>
              </li>
              <li>
                <Link href="/safety" className="transition-colors hover:text-white">
                  Safety Standards
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/join-driver"
                  className="font-medium text-red-400 transition-colors hover:text-red-300"
                >
                  Join as Driver
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="transition-colors hover:text-white">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/safety" className="transition-colors hover:text-white">
                  Safety Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Dispatch Notes */}
          <div className="space-y-4 lg:col-span-4">
            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Dispatch Notes
            </h4>
            <p className="text-sm text-slate-400">
              Monthly response-time reports and new city launches. No marketing.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-slate-700/80 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-red-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm shadow-red-600/20 transition-all hover:bg-red-700"
              >
                <span>Subscribe</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Payments secured by Stripe · PCI-DSS Level 1</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 PulseRoute Emergency Services Ltd. Dhaka, Bangladesh.</p>
          <div className="flex items-center gap-4">
            <span>English (EN)</span>
            <span className="text-slate-700">•</span>
            <span>বাংলা (BN)</span>
            <span className="text-slate-700">•</span>
            <span>Currency: BDT ৳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
