import React from 'react';
import type { Metadata } from 'next';
import RegisterForm from './_components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Patient Account — Emergency Dispatch Network',
  description:
    'Register for PulseRoute to access immediate emergency ambulance dispatch, save verified medical history, and protect your loved ones.',
  keywords: [
    'PulseRoute register',
    'Ambulance sign up Bangladesh',
    'Patient emergency registration',
    'Create medical dispatch profile',
  ],
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Create Patient Account — PulseRoute Emergency Dispatch Network',
    description:
      'Register with PulseRoute for priority emergency ambulance dispatch, real-time GPS tracking, and paramedic clinical handoffs.',
    url: '/register',
    siteName: 'PulseRoute',
    type: 'website',
    images: [
      {
        url: '/images/hero-map.png',
        width: 1200,
        height: 630,
        alt: 'PulseRoute Patient Registration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Patient Account — PulseRoute Emergency Dispatch Network',
    description:
      'Register with PulseRoute for priority emergency ambulance dispatch, real-time GPS tracking, and paramedic clinical handoffs.',
    images: ['/images/hero-map.png'],
  },
};

export default function PatientRegisterPage() {
  return <RegisterForm />;
}
