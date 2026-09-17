'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, X, AlertCircle, ArrowLeft } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);

  // 45-second resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(45);
    setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification check
    setTimeout(() => {
      setIsVerifying(false);
      if (otp === '000000') {
        setError('Invalid code, try again');
      } else {
        // Redirect to dashboard or onboarding
        router.push('/dashboard');
      }
    }, 800);
  };

  const formattedCountdown = `0:${countdown < 10 ? `0${countdown}` : countdown}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Top Logo */}
      <div className="flex flex-col items-center">
        <PulseRouteLogo subtitle="Emergency Dispatch" />
      </div>

      {/* Main Verification Card */}
      <main className="my-auto w-full max-w-[460px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Verify Your Number
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sent via SMS to <span className="font-semibold text-slate-700">+880-17X-XXX-XXXX</span>
          </p>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            {/* 6-Digit OTP Slots */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError('');
                }}
              >
                <InputOTPGroup className="gap-2 sm:gap-2.5">
                  <InputOTPSlot
                    index={0}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                  <InputOTPSlot
                    index={1}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                  <InputOTPSlot
                    index={2}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                  <InputOTPSlot
                    index={3}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                  <InputOTPSlot
                    index={4}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                  <InputOTPSlot
                    index={5}
                    className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                      error
                        ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                        : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                    }`}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend Countdown */}
            <div className="text-xs font-medium text-slate-500">
              {countdown > 0 ? (
                <span>
                  Resend OTP in{' '}
                  <strong className="font-bold text-slate-800">{formattedCountdown}</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="cursor-pointer font-bold text-red-600 hover:underline"
                >
                  Resend OTP now
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isVerifying ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Verify'
              )}
            </button>
          </form>

          {/* Change Phone Number Link */}
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Change phone number?</span>
            </Link>
          </div>
        </div>

        {/* Emergency Banner Card (matching Figma node 2:5317) */}
        {showEmergency && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-100 bg-[#FEF2F2] p-3.5 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                <Phone className="h-5 w-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Emergency?
                </p>
                <a
                  href="tel:999"
                  className="text-sm font-bold text-red-600 transition-colors hover:text-red-700"
                >
                  Call 999 Now
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEmergency(false)}
              className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-100/50 hover:text-slate-600"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs tracking-wider text-slate-400 uppercase">
        <span>© 2026 PulseRoute Inc. • Secure Verification</span>
      </footer>
    </div>
  );
}
