'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, X, Twitter, Linkedin } from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'driver'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
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

    // Password validation
    if (!password || password.length < 8) {
      setPasswordError('Min. 8 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'driver') {
        router.push('/dashboard/driver');
      } else {
        router.push('/dashboard');
      }
    }, 1000);
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
          {/* ECG Pulse Graphic from Figma */}
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
              }}
              error={passwordError}
              helperText={passwordError ? undefined : 'Min. 8 characters'}
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
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

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
