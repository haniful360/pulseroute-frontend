'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, X, Twitter, Linkedin, AlertCircle, ShieldAlert } from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { loginUserAction } from '@/services/auth/auth.service';
import { GoogleLoginButton } from '@/app/(auth)/_components/GoogleLoginButton';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [role, setRole] = useState<'patient' | 'driver'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);

  // Check for reset password success or other URL flags
  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      toast.success('Password reset successfully! Please sign in with your new password.');
    }
    if (searchParams.get('registered') === 'success') {
      toast.success('Account verified and created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Password validation (allow min 6 as per standard/seed)
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const res = await loginUserAction({
        email: email.trim(),
        password,
      });

      if (!res.success || !res.data) {
        const errorMsg = res.message || 'Login failed. Please verify your credentials.';
        setGeneralError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success(res.message || 'Welcome to PulseRoute!');
      await refreshUser();

      // Check redirect param
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      // Role-based destination
      const userRole = res.data.user.role;
      if (userRole === 'DRIVER') {
        router.push('/dashboard/driver');
      } else if (userRole === 'SUPER_ADMIN') {
        router.push('/dashboard/super-admin');
      } else {
        router.push('/dashboard/patient');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* LEFT SIDE: Brand Showcase (Dark Sidebar matching Figma 2:4868) */}
      <aside className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#1A202C] p-10 lg:flex lg:w-[45%] xl:w-[48%] xl:p-14">
        {/* Background ambient glow effect */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-3xl" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <PulseRouteLogo isDark={true} subtitle="Emergency Dispatch" />
        </div>

        {/* Center: ECG Wave and Slogan */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center">
          {/* ECG Pulse Graphic */}
          <div className="relative mb-6 w-full max-w-sm">
            <svg
              viewBox="0 0 448 168"
              fill="none"
              className="h-auto w-full text-red-500 drop-shadow-[0_0_12px_rgba(230,57,70,0.4)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 84H112L128.8 44.8L151.2 123.2L173.6 84H224L235.2 22.4L257.6 145.6L280 84H448"
                stroke="#E63946"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="max-w-md text-3xl font-extrabold tracking-tight text-white sm:text-4xl xl:text-[38px] xl:leading-tight">
            Swift Response, Every Second Counts.
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400 xl:text-base">
            Managing emergency dispatch with precision and speed across the global network.
          </p>
        </div>

        {/* Bottom: Copyright & Social Links */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400">
          <span>© 2026 PulseRoute Inc.</span>
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE: Unified Login Form (White Canvas matching Figma 2:4868) */}
      <main className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[420px]">
          {/* Mobile-only logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <PulseRouteLogo />
          </div>

          {/* Form Header */}
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0B132B] sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm font-normal text-slate-500">
              Sign in to access your PulseRoute portal.
            </p>
          </div>

          {/* Role Underline Tabs (Patient / Driver) */}
          <div className="mb-6 flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setRole('patient');
                setEmailError('');
                setPasswordError('');
                setGeneralError('');
              }}
              className={`flex-1 cursor-pointer pb-3 text-center text-sm font-semibold transition-all duration-200 ${
                role === 'patient'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('driver');
                setEmailError('');
                setPasswordError('');
                setGeneralError('');
              }}
              className={`flex-1 cursor-pointer pb-3 text-center text-sm font-semibold transition-all duration-200 ${
                role === 'driver'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Driver
            </button>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (generalError) setGeneralError('');
              }}
              error={emailError}
            />

            {/* Password */}
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (generalError) setGeneralError('');
              }}
              error={passwordError}
              helperText={passwordError ? undefined : 'Min. 6 characters'}
              rightElement={
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Forgot Password?
                </Link>
              }
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2.5 pt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="h-4 w-4 rounded border-slate-300 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
              />
              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-xs font-medium text-slate-600 select-none"
              >
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Or Continue With Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 font-semibold tracking-wider text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Google Login Button */}
          <GoogleLoginButton
            text="continue_with"
            redirectUrl={searchParams.get('redirect')}
          />

          {/* Register Callout */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <Link
              href={role === 'driver' ? '/register/driver' : '/register'}
              className="font-bold text-red-600 transition-colors hover:text-red-700"
            >
              Register
            </Link>
          </div>

          {/* Super Admin Access Link */}
          <div className="mt-4 flex items-center justify-center border-t border-slate-100 pt-4">
            <Link
              href="/super-admin/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-500 transition-colors hover:text-red-600"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <span>Super Admin & Master Dispatch Access &rarr;</span>
            </Link>
          </div>

          {/* Emergency Contact Banner (matching Figma 2:4981) */}
          {showEmergency && (
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-red-100 bg-[#FEF2F2] p-3.5 shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                  <Phone className="h-5 w-5 fill-current" />
                </div>
                <div>
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
        </div>
      </main>
    </div>
  );
}
