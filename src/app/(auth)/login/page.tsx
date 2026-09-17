'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '../_components/AuthHeader';
import { AuthFooter } from '../_components/AuthFooter';
import { EmergencyBanner } from '../_components/EmergencyBanner';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'driver'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setPasswordError('Must be at least 8 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Route appropriately after simulated login
      if (role === 'driver') {
        router.push('/dashboard/driver');
      } else {
        router.push('/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <AuthHeader subtitle={role === 'driver' ? 'Paramedic Portal' : 'Patient Portal'} />

      <main className="flex flex-1 items-center justify-center p-4 py-8">
        <div className="w-full max-w-[460px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all sm:p-10">
          {/* Header Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm font-normal text-slate-500">
              Sign in to access your PulseRoute portal.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="mb-6 flex items-center rounded-2xl bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                setRole('patient');
                setEmailError('');
                setPasswordError('');
              }}
              className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                role === 'patient'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                role === 'driver'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Driver
            </button>
          </div>

          {/* Form */}
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
              icon={<Mail className="h-4 w-4" />}
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
              icon={<Lock className="h-4 w-4" />}
              error={passwordError}
              helperText={passwordError ? undefined : 'Must be at least 8 characters'}
              rightElement={
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Forgot Password?
                </Link>
              }
            />

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="rounded-md data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
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
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all duration-200 hover:bg-red-700 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 font-semibold tracking-wider text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Google Login */}
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

          {/* Footer Register Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <Link
              href={role === 'driver' ? '/register/driver' : '/register'}
              className="font-bold text-red-600 transition-colors hover:text-red-700"
            >
              {role === 'driver' ? 'Register as Driver' : 'Register as Patient'}
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter
        supportEmail={
          role === 'driver' ? 'driver.support@pulseroute.com' : 'support@pulseroute.com'
        }
      />
      <EmergencyBanner />
    </div>
  );
}
