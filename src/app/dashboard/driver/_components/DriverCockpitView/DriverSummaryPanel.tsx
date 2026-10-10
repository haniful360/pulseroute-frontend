'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Flame,
  Loader2,
  Power,
  PowerOff,
  Radio,
  Star,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getDriverDashboardOverviewAction,
  updateDutyStatusAction,
} from '@/services/driver/driver.service';

export default function DriverSummaryPanel() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);
  // Default driver duty status is OFFLINE
  const [dutyStatus, setDutyStatus] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDriverDashboardOverviewAction();
        if (res.success && res.data) {
          setOverview(res.data);
          const currentDuty =
            res.data.duty?.dutyStatus ||
            res.data.driver?.dutyStatus ||
            res.data.dutyStatus;
          if (currentDuty === 'ONLINE' || currentDuty === 'OFFLINE') {
            setDutyStatus(currentDuty);
          }
        }
      } catch (err) {
        console.error('Failed to load driver overview:', err);
      }
    }
    loadData();
  }, []);

  const handleSetDutyStatus = async (nextStatus: 'ONLINE' | 'OFFLINE') => {
    if (dutyStatus === nextStatus && !isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateDutyStatusAction({ dutyStatus: nextStatus });
      if (res.success) {
        setDutyStatus(nextStatus);
        toast.success(
          nextStatus === 'ONLINE'
            ? 'Shift active! Unit is ONLINE on central dispatch radar.'
            : 'Shift paused. Unit is OFFLINE.'
        );
      } else {
        toast.error(res.message || 'Failed to update duty status');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating duty status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStripeWithdraw = () => {
    router.push('/dashboard/driver/wallet');
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
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                {Number(
                  overview?.financials?.totalEarnings ??
                  overview?.financials?.todayEarnings ??
                  overview?.totalEarnings ??
                  overview?.todayEarnings ??
                  overview?.driver?.wallet?.totalEarnings ??
                  overview?.driver?.wallet?.balance ??
                  0
                ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-bold text-slate-400">BDT</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
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
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {String(overview?.completedTripsCount ?? 0).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-emerald-600">● 100% Success</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-700">
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

      {/* 3. Duty Availability / Online-Offline Status Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio
              className={`h-4 w-4 ${
                dutyStatus === 'ONLINE'
                  ? 'animate-pulse text-emerald-500'
                  : 'text-slate-400'
              }`}
            />
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              DUTY STATUS
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
              dutyStatus === 'ONLINE'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border border-slate-200 bg-slate-100 text-slate-600'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dutyStatus === 'ONLINE'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span>{dutyStatus === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>

        {/* Status description */}
        <div className="mt-3.5">
          <h3 className="text-sm font-bold text-slate-900">
            {dutyStatus === 'ONLINE'
              ? 'Ready for Emergency Dispatches'
              : 'Currently Off Duty'}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {dutyStatus === 'ONLINE'
              ? 'Your ambulance is active on central dispatch radar and eligible for trip assignments.'
              : 'You are invisible to dispatch radar. Switch online when you are ready to receive trips.'}
          </p>
        </div>

        {/* Dual Online & Offline Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={() => handleSetDutyStatus('OFFLINE')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${
              dutyStatus === 'OFFLINE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PowerOff className="h-3.5 w-3.5 text-slate-400" />
            <span>Offline</span>
          </button>

          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={() => handleSetDutyStatus('ONLINE')}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${
              dutyStatus === 'ONLINE'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Power className="h-3.5 w-3.5 text-white" />
            <span>Online</span>
          </button>
        </div>

        {/* Action Toggle Button */}
        <div className="mt-3">
          {dutyStatus === 'OFFLINE' ? (
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleSetDutyStatus('ONLINE')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting Radar...</span>
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  <span>Go Online (Start Duty)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleSetDutyStatus('OFFLINE')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-[#E63946] shadow-xs transition-all hover:bg-red-100 active:scale-[0.99] disabled:opacity-60"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Disconnecting...</span>
                </>
              ) : (
                <>
                  <PowerOff className="h-4 w-4" />
                  <span>Go Offline (End Duty)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 4. Performance Rating Card */}
      <div className="flex items-center gap-3.5 rounded-3xl border border-slate-200 bg-white p-4.5 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-500">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
            <span>{overview?.driver?.rating ? Number(overview.driver.rating).toFixed(1) : '4.9'} / 5.0</span>
            <Flame className="h-4 w-4 text-[#E63946]" />
          </div>
          <p className="mt-0.5 text-xs leading-snug text-slate-500">
            You&apos;re in the top 5% of paramedics this month.
          </p>
        </div>
      </div>
    </div>
  );
}
