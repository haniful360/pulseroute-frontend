'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, X, AlertCircle, ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { verifyOtpAction, resendOtpAction } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const paramEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(paramEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);

  // Sync paramEmail if changes
  useEffect(() => {
    if (paramEmail && !email) {
      setEmail(paramEmail);
    }
  }, [paramEmail, email]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    if (!email.trim()) {
      setError('Please provide your email address to resend OTP');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const res = await resendOtpAction({ email: email.trim().toLowerCase() });
      if (res.success) {
        toast.success(res.message || 'New 6-digit verification code sent to your email.');
        setCountdown(60);
        setOtp('');
      } else {
        toast.error(res.message || 'Failed to resend OTP');
        setError(res.message || 'Failed to resend OTP');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resending OTP';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered email address');
      return;
    }
    if (otp.length < 6) {
      setError('Please enter all 6 digits of your verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await verifyOtpAction({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (!res.success || !res.data) {
        const errorMsg = res.message || 'Verification failed. Please check the code and try again.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success(res.message || 'Account activated successfully!');
      await refreshUser();

      const userRole = res.data.user.role;
      if (userRole === 'DRIVER') {
        router.push('/dashboard/driver');
      } else if (userRole === 'SUPER_ADMIN') {
        router.push('/dashboard/super-admin');
      } else {
        router.push('/dashboard/patient');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const formattedCountdown = `0:${countdown < 10 ? `0${countdown}` : countdown}`;

  // Mask email for privacy display
  const maskedEmail = React.useMemo(() => {
    if (!email) return 'your registered email';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName = name.length > 2 ? `${name.slice(0, 2)}***${name.slice(-1)}` : `${name}***`;
    return `${maskedName}@${domain}`;
  }, [email]);

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
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sent via verification email to{' '}
            <span className="font-semibold text-slate-700">{maskedEmail}</span>
          </p>

          {/* Email input field if missing */}
          {!paramEmail && (
            <div className="mt-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-red-600 focus:outline-hidden"
              />
            </div>
          )}

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
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-12 w-12 rounded-xl text-lg font-bold sm:h-14 sm:w-14 sm:text-2xl ${
                        error
                          ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                          : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                      }`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Verify CTA */}
            <button
              type="submit"
              disabled={isVerifying || otp.length < 6}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isVerifying ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Verify & Proceed'
              )}
            </button>
          </form>

          {/* Resend Countdown Link */}
          <div className="mt-6 text-xs text-slate-500">
            <span>Didn&apos;t receive the code? </span>
            {countdown > 0 ? (
              <span className="font-semibold text-slate-400">
                Resend in {formattedCountdown}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="cursor-pointer font-bold text-red-600 transition-colors hover:text-red-700 hover:underline"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Emergency Banner */}
        {showEmergency && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-100 bg-[#FEF2F2] p-3.5 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                <Phone className="h-5 w-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Need Help Immediately?
                </p>
                <a
                  href="tel:999"
                  className="text-sm font-bold text-red-600 transition-colors hover:text-red-700"
                >
                  Call 999 Hotline
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
        <span>© 2026 PulseRoute • Secure Infrastructure</span>
      </footer>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
