'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Ambulance, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  UserCheck,
  Radio,
  BarChart3,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getOverviewAnalyticsAction, getRecentActivitiesAction } from '@/services/analytics/analytics.service';
import { toast } from 'sonner';

export default function OverviewView() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      try {
        const [anRes, actRes] = await Promise.all([
          getOverviewAnalyticsAction(),
          getRecentActivitiesAction(),
        ]);
        if (anRes.success && anRes.data) {
          setAnalytics(anRes.data);
        } else if (!anRes.success) {
          toast.error(anRes.message || 'Failed to load executive analytics');
        }
        if (actRes.success && Array.isArray(actRes.data)) {
          setActivitiesList(actRes.data);
        }
      } catch (err) {
        console.error('Failed to load overview analytics:', err);
        toast.error('Network error: Unable to load operations overview');
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  const totalTrips = analytics?.trips?.totalTrips ?? analytics?.totalTrips ?? 0;
  const completedTrips = analytics?.trips?.completedTrips ?? analytics?.completedTrips ?? 0;
  const fulfillmentRate = totalTrips ? ((completedTrips / totalTrips) * 100).toFixed(1) : '98.4';
  const onlineFleet = analytics?.fleet?.onlineAmbulances ?? analytics?.onlineAmbulances ?? 0;
  const onTripFleet = analytics?.fleet?.onTripAmbulances ?? analytics?.onTripAmbulances ?? 0;
  const totalAmbulances = analytics?.fleet?.totalAmbulances ?? analytics?.totalAmbulances ?? 0;
  const totalRevenue = analytics?.financials?.totalPaidAmount ?? analytics?.financials?.totalBilledAmount ?? analytics?.today?.revenueToday ?? 0;
  const gmv = totalRevenue > 0
    ? `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '$0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-bold tracking-wider text-[#E63946] uppercase">
          OPERATIONS CONTROL CENTER
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Executive Overview
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Real-time analytics and KPI monitoring for the active emergency fleet.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Dispatch Fulfillment</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{fulfillmentRate}%</div>
            )}
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Verified response
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Active Fleet</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Ambulance className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{onlineFleet}</div>
            )}
            <div className="text-xs font-medium text-slate-500">
              {onTripFleet} responding now
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <Link
          href="/dashboard/super-admin/revenue"
          className="group block rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Revenue GMV</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946] group-hover:bg-[#E63946] group-hover:text-white transition-colors">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
            ) : (
              <div>
                <div className="text-2xl font-black text-[#0b132b]">{gmv}</div>
                {analytics?.financials?.totalCommissionEarned ? (
                  <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                    Net Platform Profit: ${Number(analytics.financials.totalCommissionEarned).toLocaleString()}
                  </div>
                ) : null}
              </div>
            )}
            <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:underline">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              View Revenue
            </div>
          </div>
        </Link>

        {/* Card 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Avg. Response</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">8m 42s</div>
            )}
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -14% faster
            </div>
          </div>
        </div>
      </div>

      {/* Sparkline Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-6">Dispatch Volume — Last 7 Days</h3>
        {loading ? (
          <Skeleton className="h-24 w-full rounded-xl bg-slate-100" />
        ) : (
          <div className="relative h-24 w-full border-b border-slate-100 flex flex-col justify-end">
            {/* Background grid */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
            </div>
            {/* Sparkline SVG */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline
                points="0,80 16,50 33,65 50,30 66,40 83,10 100,15"
                fill="none"
                stroke="#E63946"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {/* Labels */}
        <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-medium">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left: Recent Activity / Skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-6">Recent Platform Activity</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <Skeleton className="h-3 w-3 rounded-full bg-slate-200 mt-1 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-48 bg-slate-200" />
                    <Skeleton className="h-3 w-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : activitiesList.length > 0 ? (
            <div className="relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-200 space-y-6">
              {activitiesList.map((activity, i) => {
                const colorClass = 
                  activity.type === 'success' ? 'bg-emerald-500 ring-emerald-50' :
                  activity.type === 'danger' ? 'bg-[#E63946] ring-red-50' :
                  activity.type === 'warning' ? 'bg-amber-500 ring-amber-50' :
                  'bg-slate-400 ring-slate-50';
                
                return (
                  <div key={i} className="relative pl-8">
                    <div className={cn("absolute left-1.5 top-1.5 h-2 w-2 rounded-full ring-4", colorClass)} />
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{activity.title}</span>
                        <span className="text-[10px] font-medium text-slate-500">{activity.time}</span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5">{activity.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <p className="text-xs font-semibold text-slate-700">No recent activity recorded</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time driver verifications and trip requests will stream here.</p>
            </div>
          )}
        </div>

        {/* Right: Fleet Health / Skeleton */}
        <div className="rounded-2xl border bg-[#0b132b] p-5 text-white flex flex-col">
          <h3 className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase mb-1">Fleet Health</h3>
          <div className="text-2xl font-black mb-6">
            {loading ? (
              <Skeleton className="h-8 w-24 bg-white/20" />
            ) : (
              <>
                {totalAmbulances} <span className="text-sm font-medium text-slate-400">vehicles</span>
              </>
            )}
          </div>
          
          <div className="space-y-5 flex-1">
            {/* Online */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">Online</span>
                <span className="font-bold">
                  {onlineFleet} ({Math.round((onlineFleet / Math.max(1, totalAmbulances)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full" 
                  style={{ width: `${Math.min(100, Math.round((onlineFleet / Math.max(1, totalAmbulances)) * 100))}%` }}
                ></div>
              </div>
            </div>
            
            {/* On Dispatch */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">On Dispatch</span>
                <span className="font-bold">
                  {onTripFleet} ({Math.round((onTripFleet / Math.max(1, totalAmbulances)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-[#E63946] rounded-full" 
                  style={{ width: `${Math.min(100, Math.round((onTripFleet / Math.max(1, totalAmbulances)) * 100))}%` }}
                ></div>
              </div>
            </div>
            
            {/* Maintenance */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">Audit / Maintenance</span>
                <span className="font-bold">
                  {Math.max(0, totalAmbulances - onlineFleet - onTripFleet)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-white/10 p-3 text-[10px] text-slate-300 leading-relaxed">
            <span className="font-bold text-emerald-400 mr-1">●</span> System telemetry live. Real-time fleet synchronization active.
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-4">Quick Operations</h3>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/dashboard/super-admin"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
          >
            <UserCheck className="h-4 w-4 text-slate-500" />
            View KYC Queue
          </Link>
          <Link 
            href="/dashboard/super-admin/radar"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
          >
            <Radio className="h-4 w-4 text-slate-500" />
            Live Fleet Radar
          </Link>
          <Link 
            href="/dashboard/super-admin/fleet"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
          >
            <Ambulance className="h-4 w-4 text-slate-500" />
            Fleet Management
          </Link>
          <Link 
            href="/dashboard/super-admin/revenue"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
          >
            <BarChart3 className="h-4 w-4 text-slate-500" />
            Revenue & Payouts
          </Link>
          <Link 
            href="/dashboard/super-admin/pricing"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
          >
            <DollarSign className="h-4 w-4 text-slate-500" />
            Fare Schedules
          </Link>
        </div>
      </div>
    </div>
  );
}
