'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Phone, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface Step4Props {
  phoneNumber: string;
  onVerify: () => void;
  onBack: () => void;
  onChangePhone: () => void;
}

export const Step4Otp: React.FC<Step4Props> = ({
  phoneNumber,
  onVerify,
  onBack,
  onChangePhone,
}) => {
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(299); // 4 minutes 59 seconds
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Format phone number for privacy display (e.g. +880 17XX-XXXXXX)
  const maskedPhone = React.useMemo(() => {
    if (!phoneNumber) return '+880 1XXX-XXXXXX';
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length > 4) {
      return `+880 ${clean.slice(0, 3)}XX-${clean.slice(-4)}`;
    }
    return `+880 ${clean}`;
  }, [phoneNumber]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResend = () => {
    if (timer > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimer(299);
      setOtpValue('');
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerify();
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-md space-y-8 py-2">
      {/* Top Circular Back Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs transition-colors hover:bg-red-100"
          aria-label="Go back to vehicle details"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Verify your Phone Number
        </h2>
        <p className="text-xs font-normal text-slate-500 sm:text-sm">
          We sent a 6-digit code to{' '}
          <strong className="font-semibold text-slate-800">{maskedPhone}</strong>
        </p>
      </div>

      {/* 6-Digit Shadcn InputOTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(val) => {
              setOtpValue(val);
              if (error) setError('');
            }}
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              <InputOTPSlot
                index={0}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
              <InputOTPSlot
                index={1}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
              <InputOTPSlot
                index={2}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
              <InputOTPSlot
                index={3}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
              <InputOTPSlot
                index={4}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
              <InputOTPSlot
                index={5}
                className="h-13 w-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-xl font-extrabold data-[active=true]:border-red-500 data-[active=true]:bg-white data-[active=true]:ring-2 data-[active=true]:ring-red-500/20 sm:h-15 sm:w-13 sm:text-2xl"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && <p className="text-center text-xs font-medium text-red-600">{error}</p>}

        {/* Resend Countdown */}
        <div className="text-center text-xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-500">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>Didn&apos;t receive the code?</span>
          </div>

          <div className="mt-2">
            {timer > 0 ? (
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-600">
                RESEND IN {formatTimer(timer)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-red-600 underline hover:text-red-700"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend Code Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={isVerifying}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700 disabled:opacity-70"
          >
            {isVerifying ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onChangePhone}
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Change Phone Number
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
