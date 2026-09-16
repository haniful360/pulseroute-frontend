'use client';

import { CheckCircle2, MessageSquare, SendHorizonal } from 'lucide-react';
import React, { useState } from 'react';

interface OfficeLocation {
  city: string;
  address: string;
  phone: string;
}

const OFFICES: OfficeLocation[] = [
  {
    city: 'Dhaka HQ',
    address: 'House 27, Road 11, Banani, Dhaka 1213',
    phone: '+880 1700 000 100',
  },
  {
    city: 'Chattogram',
    address: 'Level 4, Agrabad C/A, Chattogram 4100',
    phone: '+880 1700 000 200',
  },
  {
    city: 'Sylhet',
    address: 'Zindabazar Main Road, Sylhet 3100',
    phone: '+880 1700 000 300',
  },
];

export const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 800);
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Complaints go straight to the medical command centre — we investigate every one
                against the trip record.
              </p>
            </div>

            {isSubmitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center sm:p-10">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Enquiry Received</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you for reaching out. A dispatcher from our command centre will review your
                  message and reply within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-700">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Trip enquiry, invoice, feedback..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Include a trip reference if this is about a completed trip."
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition-all hover:bg-red-700 disabled:opacity-70"
                >
                  <SendHorizonal className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit enquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Live Chat Box + Office Locations */}
          <div className="space-y-6 lg:col-span-5">
            {/* Live Support / Map Box */}
            <div className="relative flex aspect-[16/9] w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-100 to-slate-200/70 p-6 shadow-xs sm:aspect-[16/10]">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Dispatch Operations Live
                </span>
                <h3 className="pt-2 text-base font-bold text-slate-900">Medical Command Centre</h3>
                <p className="text-xs text-slate-500">
                  24/7 supervision over telemetry, triage and sanitisation logs.
                </p>
              </div>

              {/* Floating Chat Trigger */}
              <div className="flex justify-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-transform hover:scale-105">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* 3 Regional Office Cards */}
            <div className="space-y-4">
              {OFFICES.map((office) => (
                <div
                  key={office.city}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
                >
                  <h4 className="text-sm font-bold text-slate-900">{office.city}</h4>
                  <p className="mt-1 text-xs text-slate-600">{office.address}</p>
                  <a
                    href={`tel:${office.phone.replace(/\s+/g, '')}`}
                    className="mt-2.5 inline-block text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    {office.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
