'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { verifyOtpAction, resendOtpAction } from '@/services/auth.service';
import { toast } from 'sonner';

interface Step4Props {
  email: string;
  phoneNumber: string;
  onVerify: () => void;
  onBack: () => void;
  onChangePhone: () => void;
}

export const Step4Otp: React.FC<Step4Props> = ({
  email,
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

  // Mask email for privacy display
  const maskedEmail = React.useMemo(() => {
    if (!email) return 'your registered email';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName = name.length > 2 ? `${name.slice(0, 2)}***${name.slice(-1)}` : `${name}***`;
    return `${maskedName}@${domain}`;
  }, [email]);

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

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await resendOtpAction({ email });
      if (res.success) {
        toast.success(res.message || 'New OTP has been sent to your email.');
        setTimer(299);
        setOtpValue('');
        setError('');
      } else {
        toast.error(res.message || 'Failed to resend OTP');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resending OTP';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await verifyOtpAction({
        email: email.trim().toLowerCase(),
        otp: otpValue.trim(),
      });

      if (res.success) {
        toast.success(res.message || 'Driver application verified successfully!');
        onVerify();
      } else {
        setError(res.message || 'Invalid or expired OTP code');
        toast.error(res.message || 'Invalid or expired OTP code');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
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
          Verify your Email
        </h2>
        <p className="text-xs font-normal text-slate-500 sm:text-sm">
          We sent a 6-digit verification code to{' '}
          <strong className="font-semibold text-slate-800">{maskedEmail}</strong>
        </p>
      </div>

      {/* 6-Digit Shadcn InputOTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(val) => {
              setOtpValue(val);
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

          {/* Validation Error Message */}
          {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}
        </div>

        {/* Resend Code Section */}
        <div className="flex items-center justify-between px-1 text-xs sm:text-sm">
          <span className="font-medium text-slate-500">
            Expires in: <strong className="text-slate-800">{formatTimer(timer)}</strong>
          </span>

          <button
            type="button"
            disabled={timer > 0 || isResending}
            onClick={handleResend}
            className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
              timer > 0 || isResending
                ? 'cursor-not-allowed text-slate-400'
                : 'cursor-pointer text-red-600 hover:text-red-700 hover:underline'
            }`}
          >
            {isResending ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span>Resend Code</span>
          </button>
        </div>

        {/* Verify and Submit Button */}
        <button
          type="submit"
          disabled={otpValue.length < 6 || isVerifying}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVerifying ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <span>Verify & Complete Registration</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Change Info Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onChangePhone}
          className="cursor-pointer text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 hover:underline"
        >
          Need to change registration email or phone?
        </button>
      </div>
    </div>
  );
};
