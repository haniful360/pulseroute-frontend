'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { CheckCircle2, Check, Headphones, X, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(true);

  // Password criteria checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passedCriteriaCount = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(
    Boolean,
  ).length;

  const getStrengthLabel = () => {
    if (!password) return '';
    if (passedCriteriaCount <= 1) return 'WEAK';
    if (passedCriteriaCount === 2) return 'FAIR';
    if (passedCriteriaCount === 3) return 'GOOD';
    return 'STRONG';
  };

  const getStrengthColor = () => {
    if (passedCriteriaCount <= 1) return 'text-red-500';
    if (passedCriteriaCount === 2) return 'text-amber-500';
    if (passedCriteriaCount === 3) return 'text-emerald-500';
    return 'text-emerald-600';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (code.length < 6) {
      setCodeError('Please enter the 6-digit verification code');
      hasError = true;
    } else {
      setCodeError('');
    }

    if (!password || passedCriteriaCount < 3) {
      setPasswordError('Please create a stronger password');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmError('');
    }

    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Success -> route to login
      router.push('/login?reset=success');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Top Section with Toast and Logo */}
      <div className="flex flex-col items-center">
        {/* Top Notification Toast (matching Figma 2:5510) */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0B132B] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-slate-900/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Reset code sent to your email</span>
        </div>

        <PulseRouteLogo subtitle="Emergency Dispatch" />
      </div>

      {/* Main Reset Card */}
      <main className="my-auto w-full max-w-[460px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Please enter the 6-digit code and choose a secure new password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* 1. Verification Code */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-600 uppercase">
                Verification Code
              </label>
              <div className="flex justify-start">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    if (codeError) setCodeError('');
                  }}
                >
                  <InputOTPGroup className="gap-2 sm:gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <InputOTPSlot
                        key={idx}
                        index={idx}
                        className={`h-11 w-11 rounded-xl text-base font-bold sm:h-12 sm:w-12 sm:text-xl ${
                          codeError
                            ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                            : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {codeError && <p className="mt-2 text-xs font-semibold text-red-600">{codeError}</p>}
            </div>

            {/* 2. New Password */}
            <div className="space-y-3">
              <InputField
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="Pulse2024!"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
              />

              {/* Live Password Strength Meter */}
              {password && (
                <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                    <span className="text-slate-500">Strength</span>
                    <span className={getStrengthColor()}>{getStrengthLabel()}</span>
                  </div>

                  {/* 4 Segment Bars */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          bar <= passedCriteriaCount
                            ? passedCriteriaCount <= 1
                              ? 'bg-red-500'
                              : passedCriteriaCount === 2
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* 4 Criteria Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div
                      className={`flex items-center gap-1.5 ${
                        hasMinLength ? 'font-semibold text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>8+ Characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        hasUppercase ? 'font-semibold text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Uppercase</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        hasNumber ? 'font-semibold text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Number</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        hasSpecialChar ? 'font-semibold text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Special Char</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Confirm Password */}
            <div>
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError('');
                }}
                error={confirmError}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Support Banner (matching Figma node 2:5392) */}
        {showSupport && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-[#F0F4F8] p-3.5 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white shadow-sm">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Facing Issues?
                </p>
                <a
                  href="mailto:support@pulseroute.com"
                  className="text-sm font-bold text-slate-900 transition-colors hover:text-red-600"
                >
                  Contact System Admin
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSupport(false)}
              className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
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
