'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Activity,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { loginSuperAdminAction } from '@/services/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function SuperAdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberTerminal, setRememberTerminal] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid administrative email');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password || password.length < 6) {
      setPasswordError('Master password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const res = await loginSuperAdminAction({
        email: email.trim(),
        password,
      });

      if (!res.success || !res.data) {
        const errorMsg =
          res.message || 'Access Denied: Only Super Administrators can log in through this portal.';
        setGeneralError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // STRICT ROLE VERIFICATION: Only allow SUPER_ADMIN
      const userRole = res.data.user.role;
      if (userRole !== 'SUPER_ADMIN') {
        const unauthorizedMsg =
          'Access Denied: The authenticated account does not possess Super Administrator clearance.';
        setGeneralError(unauthorizedMsg);
        toast.error(unauthorizedMsg);
        return;
      }

      toast.success(`Clearance Level 5 Verified. Welcome, ${res.data.user.name || 'Super Admin'}!`);
      await refreshUser();

      // Check redirect param
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl && redirectUrl.startsWith('/dashboard/super-admin')) {
        router.push(redirectUrl);
      } else {
        router.push('/dashboard/super-admin');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected terminal error occurred';
      setGeneralError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* LEFT SIDE: Brand & Master Telemetry (Dark Sidebar) */}
      <aside className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#1A202C] p-10 lg:flex lg:w-[45%] xl:w-[48%] xl:p-14">
        {/* Background ambient glow effect */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-3xl" />

        {/* Top Header Logo & Clearance Indicator */}
        <div className="relative z-10 flex items-center justify-between">
          <PulseRouteLogo isDark={true} subtitle="Master Administration" />
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-red-400 uppercase">
            <Radio className="h-3 w-3 animate-pulse text-red-500" />
            <span>Root L5</span>
          </div>
        </div>

        {/* Center: Command Telemetry & Operations Showcase */}
        <div className="relative z-10 my-auto py-8">
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                PulseRoute Global Control
              </span>
              <h2 className="text-xl font-black tracking-tight text-white xl:text-2xl">
                Master Operations Matrix
              </h2>
            </div>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Dedicated administrative gateway for global ambulance fleet surveillance, hospital
            interlink routing, paramedic credential governance, and emergency response telemetry.
          </p>

          {/* System Telemetry Badges */}
          <div className="mt-8 space-y-3 max-w-md">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0F1523]/80 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Global Dispatch Network</h3>
                  <p className="text-[11px] text-slate-500">Real-time GPS & Telemetry Engine</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0F1523]/80 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Cryptographic Audit Trail</h3>
                  <p className="text-[11px] text-slate-500">256-Bit TLS Immutable Logging</p>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                PROTECTED
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0F1523]/80 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Emergency Override Protocol</h3>
                  <p className="text-[11px] text-slate-500">Sub-second Paramedic Interconnect</p>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-red-400 uppercase">
                READY
              </span>
            </div>
          </div>

          {/* ECG Pulse Graphic */}
          <div className="relative mt-8 w-full max-w-sm">
            <svg
              viewBox="0 0 448 100"
              fill="none"
              className="h-10 w-full text-red-500 drop-shadow-[0_0_12px_rgba(230,57,70,0.4)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 50H112L128.8 24.8L151.2 75.2L173.6 50H224L235.2 12.4L257.6 89.6L280 50H448"
                stroke="#E63946"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Bottom: Version */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Master Gateway v3.4</span>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE: White Background Form Canvas */}
      <main className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[420px]">
          {/* Mobile-only logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <PulseRouteLogo isDark={false} subtitle="Super Admin Console" />
          </div>

          {/* Form Header */}
          <div className="mb-6 text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-bold tracking-wider text-red-600">
              <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
              <span>SUPER ADMINISTRATOR ACCESS</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0B132B] sm:text-3xl">
              Master Control Access
            </h1>
            <p className="mt-1.5 text-sm font-normal text-slate-500">
              Sign in with root administrative credentials to access global controls.
            </p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span className="leading-relaxed">{generalError}</span>
            </div>
          )}

          {/* Login Form using InputField */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Administrative Email */}
            <InputField
              id="admin-email"
              label="Administrative Email"
              type="email"
              placeholder="admin@pulseroute.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (generalError) setGeneralError('');
              }}
              error={emailError}
              required
            />

            {/* Master Password */}
            <InputField
              id="admin-password"
              label="Master Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (generalError) setGeneralError('');
              }}
              error={passwordError}
              helperText={passwordError ? undefined : 'Min. 6 characters'}
              required
            />

            {/* Security Session Checkbox */}
            <div className="flex items-center space-x-2.5 pt-1">
              <Checkbox
                id="rememberTerminal"
                checked={rememberTerminal}
                onCheckedChange={(checked) => setRememberTerminal(checked === true)}
                className="h-4 w-4 rounded border-slate-300 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
              />
              <label
                htmlFor="rememberTerminal"
                className="cursor-pointer text-xs font-medium text-slate-600 select-none"
              >
                High-Security Terminal Session (12 Hours)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="super-admin-submit-btn"
              disabled={isLoading}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Verifying..</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Return to Standard Login Portal */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-red-600"
            >
              <span>&larr; Return to Standard Patient & Driver Portal</span>
            </Link>
          </div>

          {/* Security Monitoring Disclaimer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Encrypted via TLS 1.3 • Zero-Trust Access Protocol</span>
          </div>
        </div>
      </main>
    </div>
  );
}
