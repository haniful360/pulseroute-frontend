'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { Mail, ArrowLeft, Headphones, X, AlertCircle } from 'lucide-react';
import { forgotPasswordAction } from '@/services/auth.service';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid registered email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await forgotPasswordAction({ email: email.trim().toLowerCase() });
      if (!res.success) {
        const errorMsg = res.message || 'No account found with this email address';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success(res.message || 'Password reset OTP sent to your email!');
      router.push(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending reset code';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
      {/* Top Logo */}
      <div className="flex flex-col items-center">
        <PulseRouteLogo subtitle="Emergency Dispatch" />
      </div>

      {/* Main Card */}
      <main className="my-auto w-full max-w-[460px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Enter your registered email address and we&apos;ll send you a 6-digit code to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <InputField
              id="email"
              label="Registered Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              icon={<Mail className="h-4 w-4" />}
              error={error}
            />

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Send Reset Code'
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

        {/* Support Banner (matching Reset Password card footer) */}
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
