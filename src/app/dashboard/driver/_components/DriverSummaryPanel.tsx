'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, DollarSign, Flame, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverSummaryPanel() {
  // Live shift clock starting from 06:42:15 (24135 seconds)
  const [seconds, setSeconds] = useState(24135);
  const [isShiftEnded, setIsShiftEnded] = useState(false);

  useEffect(() => {
    if (isShiftEnded) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isShiftEnded]);

  const formatTime = (totalSecs: number) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleEndShift = () => {
    if (isShiftEnded) {
      setIsShiftEnded(false);
      toast.success('Shift resumed! Duty radar is active.');
    } else {
      setIsShiftEnded(true);
      toast.info('Shift ended successfully. Logged 06:42+ hours.');
    }
  };

  const handleStripeWithdraw = () => {
    toast.success('Payout initiated! 12,450.00 BDT transferring to Stripe account.');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
            TODAY&apos;S SUMMARY
          </h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
          Nov 24, 2024
        </div>
      </div>

      {/* 1. Total Earnings Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              TOTAL EARNINGS
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                12,450.00
              </span>
              <span className="text-sm font-bold text-slate-400">BDT</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.5% vs avg</span>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleStripeWithdraw}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0B132B] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.99]"
          >
            <DollarSign className="h-4 w-4 text-[#06D6A0]" />
            <span>Withdraw to Stripe</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Completed Trips Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              COMPLETED TRIPS
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">08</span>
              <span className="text-xs font-semibold text-emerald-600">● 100% Success</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 border border-slate-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#E63946]" />
              Emergency Dispatches
            </span>
            <span className="font-bold text-slate-900">06</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Standard Transport
            </span>
            <span className="font-bold text-slate-900">02</span>
          </div>

          {/* Segmented bar */}
          <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[75%] bg-[#E63946]" />
            <div className="h-full w-[25%] bg-slate-400" />
          </div>
        </div>
      </div>

      {/* 3. Active Duty Hours Card (Red Gradient with Live Monospace Timer) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E63946] to-[#C1121F] p-5 text-white shadow-lg shadow-red-500/25">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-white/80 uppercase">
            ACTIVE DUTY HOURS
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>LIVE CLOCK</span>
          </div>
        </div>

        {/* Digital Counter */}
        <div className="mt-4">
          <div className="font-mono text-4xl font-extrabold tracking-wider text-white sm:text-5xl">
            {formatTime(seconds)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-medium text-white/80">
            <span>SHIFT TARGET: 09:00 Hours</span>
            <span className="font-bold text-white">74%</span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[74%] rounded-full bg-white" />
          </div>
        </div>

        {/* End Shift Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleEndShift}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-bold text-[#E63946] shadow-md transition-all hover:bg-slate-50 active:scale-[0.99]"
          >
            <Clock className="h-4 w-4" />
            <span>{isShiftEnded ? 'Resume Shift' : 'End Shift'}</span>
          </button>
        </div>
      </div>

      {/* 4. Performance Rating Card */}
      <div className="flex items-center gap-3.5 rounded-3xl border border-slate-200 bg-white p-4.5 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
            <span>4.9 / 5.0</span>
            <Flame className="h-4 w-4 text-[#E63946]" />
          </div>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
            You&apos;re in the top 5% of paramedics this month.
          </p>
        </div>
      </div>
    </div>
  );
}
