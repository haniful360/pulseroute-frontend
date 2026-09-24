'use client';

import React from 'react';
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
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const activities = [
  { title: 'New driver approved', desc: 'Rahim Uddin (#DRV-8821) passed KYC verification', time: '2 min ago', type: 'success' },
  { title: 'Critical dispatch initiated', desc: 'ICU ambulance dispatched to Dhanmondi sector', time: '8 min ago', type: 'danger' },
  { title: 'Payout processed', desc: 'BDT 184K settled to 32 operators via Stripe', time: '24 min ago', type: 'info' },
  { title: 'Fleet alert', desc: 'Vehicle DH-311 maintenance overdue by 3 days', time: '1 hr ago', type: 'warning' },
  { title: 'New hospital onboarded', desc: 'Evercare Hospital joined as dispatch partner', time: '3 hrs ago', type: 'success' },
];

export default function OverviewView() {
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
          Real-time analytics and KPI monitoring for the active fleet.
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
            <div className="text-2xl font-black text-[#0b132b]">98.4%</div>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +4.8% this month
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
            <div className="text-2xl font-black text-[#0b132b]">84</div>
            <div className="text-xs font-medium text-slate-500">
              12 responding now
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Monthly GMV</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-[#0b132b]">৳4.82M</div>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +18.2% vs August
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Avg. Response</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-[#0b132b]">8m 42s</div>
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
        {/* Left: Recent Activity */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-6">Recent Platform Activity</h3>
          <div className="relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-200 space-y-6">
            {activities.map((activity, i) => {
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
        </div>

        {/* Right: Fleet Health */}
        <div className="rounded-2xl border bg-[#0b132b] p-5 text-white flex flex-col">
          <h3 className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase mb-1">Fleet Health</h3>
          <div className="text-2xl font-black mb-6">84 <span className="text-sm font-medium text-slate-400">vehicles</span></div>
          
          <div className="space-y-5 flex-1">
            {/* Online */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">Online</span>
                <span className="font-bold">62 (74%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>
            
            {/* On Dispatch */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">On Dispatch</span>
                <span className="font-bold">12 (14%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#E63946] rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
            
            {/* Maintenance */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">Maintenance</span>
                <span className="font-bold">6 (7%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '7%' }}></div>
              </div>
            </div>
            
            {/* Offline */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-300">Offline</span>
                <span className="font-bold">4 (5%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-white/10 p-3 text-[10px] text-slate-300 leading-relaxed">
            <span className="font-bold text-emerald-400 mr-1">●</span> System operating normally. All regional hubs connected.
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs">
            <UserCheck className="h-4 w-4 text-slate-500" />
            View KYC Queue
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs">
            <Radio className="h-4 w-4 text-slate-500" />
            Fleet Radar
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            Revenue Report
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-2xs">
            <DollarSign className="h-4 w-4 text-slate-500" />
            Manage Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
