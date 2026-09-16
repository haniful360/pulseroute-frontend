'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { Menu, Phone, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ambulance Types', href: '/#vehicles' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Fare Estimator', href: '/#booking' },
  { label: 'Safety Standards', href: '/safety' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-200 ${
        isScrolled
          ? 'border-b border-slate-200/80 py-3 shadow-sm'
          : 'border-b border-slate-100 py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <PulseRouteLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-slate-600 transition-colors hover:text-red-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Items (Desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Language Switcher Pill */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  lang === 'EN'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('BN')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  lang === 'BN'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                BN
              </button>
            </div>

            {/* Emergency Hotline */}
            <DynamicActionButton
              href="tel:999"
              variant="emergency"
              size="sm"
              rounded="full"
              className="gap-1.5 px-3 text-xs font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </span>
              <Phone className="h-3.5 w-3.5" />
              <span>24/7: 999</span>
            </DynamicActionButton>

            {/* Login Link */}
            <DynamicActionButton
              href="/login"
              variant="ghost"
              size="sm"
              rounded="full"
              label="Login"
              className="text-xs font-semibold text-slate-700 hover:text-red-600"
            />

            {/* Register CTA Button */}
            <DynamicActionButton
              href="/register"
              label="Register"
              size="sm"
              rounded="full"
              className="px-4 text-xs font-semibold shadow-sm shadow-red-600/20"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <DynamicActionButton
              href="tel:999"
              variant="emergency"
              size="xs"
              rounded="full"
              className="gap-1 px-2.5 font-bold md:hidden"
            >
              <Phone className="h-3 w-3" />
              <span>999</span>
            </DynamicActionButton>
            <DynamicActionButton
              type="button"
              variant="ghost"
              size="icon"
              rounded="lg"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="text-slate-700 hover:bg-slate-100"
            >
              <Menu className="h-6 w-6" />
            </DynamicActionButton>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Matches Figma Frame 1:794) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs transform flex-col justify-between bg-white p-6 shadow-2xl transition-transform sm:max-w-sm">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <PulseRouteLogo />
                <DynamicActionButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  rounded="lg"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  <X className="h-5 w-5" />
                </DynamicActionButton>
              </div>

              {/* Navigation Links */}
              <div className="divide-y divide-slate-100 py-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-medium text-slate-700 transition-colors hover:text-red-600"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#driver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-sm font-semibold text-slate-900 transition-colors hover:text-red-600"
                >
                  Join as Driver
                </Link>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              {/* Call 999 Button */}
              <DynamicActionButton
                href="tel:999"
                variant="default"
                rounded="xl"
                size="lg"
                fullWidth
                icon={Phone}
                showIcon
                iconPosition="left"
                label="Call 999 now"
                className="font-semibold shadow-md shadow-red-600/20"
              />

              {/* Login and Register in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <DynamicActionButton
                  href="/login"
                  variant="outline"
                  rounded="lg"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  label="Login"
                  className="text-xs"
                />
                <DynamicActionButton
                  href="/register"
                  variant="secondary"
                  rounded="lg"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  label="Register"
                  className="text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
