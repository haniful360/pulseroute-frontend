'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { CheckCircle2, Check, Headphones, X, ArrowLeft, Mail } from 'lucide-react';
import { resetPasswordAction } from '@/services/auth.service';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(paramEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Please enter your registered email');
      hasError = true;
    } else {
      setEmailError('');
    }

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

    try {
      const res = await resetPasswordAction({
        email: email.trim().toLowerCase(),
        otp: code.trim(),
        newPassword: password,
      });

      if (!res.success) {
        const errorMsg = res.message || 'Failed to reset password. Please check your code.';
        setCodeError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success(res.message || 'Password reset successfully! Please sign in.');
      router.push('/login?reset=success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      setCodeError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Top Section with Toast and Logo */}
      <div className="flex flex-col items-center">
        {/* Top Notification Toast */}
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
            {/* Email Address */}
            <InputField
              id="email"
              label="Registered Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              icon={<Mail className="h-4 w-4" />}
              error={emailError}
            />

            {/* 1. Verification Code */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-600 uppercase">
                Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    if (codeError) setCodeError('');
                  }}
                >
                  <InputOTPGroup className="gap-2 sm:gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={`h-11 w-11 rounded-xl text-base font-bold sm:h-12 sm:w-12 sm:text-lg ${
                          codeError
                            ? 'border-red-500 bg-red-50/40 text-red-600 focus:border-red-600'
                            : 'border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {codeError && (
                <p className="mt-2 text-center text-xs font-medium text-red-500">{codeError}</p>
              )}
            </div>

            {/* 2. New Password */}
            <div className="space-y-2">
              <InputField
                id="password"
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Security strength:</span>
                    <span className={`font-bold ${getStrengthColor()}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          step <= passedCriteriaCount
                            ? passedCriteriaCount <= 1
                              ? 'bg-red-500'
                              : passedCriteriaCount === 2
                                ? 'bg-amber-500'
                                : passedCriteriaCount === 3
                                  ? 'bg-emerald-500'
                                  : 'bg-emerald-600'
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
                <div
                  className={`flex items-center gap-1.5 ${
                    hasMinLength ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      hasMinLength ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300'
                    }`}
                  >
                    {hasMinLength && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span>Min. 8 characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasUppercase ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      hasUppercase ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300'
                    }`}
                  >
                    {hasUppercase && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span>1 uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasNumber ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      hasNumber ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300'
                    }`}
                  >
                    {hasNumber && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span>1 number</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    hasSpecialChar ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                      hasSpecialChar ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300'
                    }`}
                  >
                    {hasSpecialChar && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span>1 special symbol</span>
                </div>
              </div>
            </div>

            {/* 3. Confirm Password */}
            <InputField
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              error={confirmError}
            />

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || code.length < 6 || !password}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Save & Log In'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Support Banner */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
