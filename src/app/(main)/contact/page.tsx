import React from 'react';
import { ContactHeroSection } from './_components/ContactHeroSection';
import { ContactFormSection } from './_components/ContactFormSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & 24/7 Emergency Command Hub — PulseRoute',
  description:
    '24/7 Emergency Ambulance Hotline 999 integration. Contact PulseRoute medical command centre, Dhaka HQ, Chattogram, and Sylhet operational desks.',
  keywords: [
    'Ambulance contact number',
    'Emergency ambulance hotline Bangladesh',
    'PulseRoute command hub',
    'Dhaka ambulance phone number',
    'Medical transport inquiry',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us & 24/7 Emergency Command Hub — PulseRoute',
    description:
      '24/7 emergency dispatch support, hospital integration desks, and regional coordination hubs across Bangladesh.',
    url: '/contact',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Emergency Command Hub and Contact Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & 24/7 Emergency Command Hub — PulseRoute',
    description:
      '24/7 emergency dispatch support, hospital integration desks, and regional coordination hubs across Bangladesh.',
    images: ['/images/hero-map.png'],
  },
};

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <ContactHeroSection />
      <ContactFormSection />
    </div>
  );
}
