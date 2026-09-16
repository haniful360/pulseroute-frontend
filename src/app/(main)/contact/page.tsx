import React from 'react';
import { ContactHeroSection } from './_components/ContactHeroSection';
import { ContactFormSection } from './_components/ContactFormSection';

export const metadata = {
  title: 'Contact Us & Emergency Hotline — PulseRoute',
  description:
    '24/7 Emergency Ambulance Hotline 999. Reach PulseRoute medical command centre, Dhaka HQ, Chattogram, and Sylhet offices.',
};

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <ContactHeroSection />
      <ContactFormSection />
    </div>
  );
}
