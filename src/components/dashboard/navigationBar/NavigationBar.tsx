'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { roleTypes } from '../sidebar/sidebarRoutes';
import { DynamicBreadcrumb } from './_components/DynamicBreadcrumb/DynamicBreadcrumb';
import RightSection from './_components/RightSection/RightSection';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NavigationBar({ role }: { role: roleTypes }) {
  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isLight = isPatient || isDriver || isSuperAdmin;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full shrink-0 items-center px-4 py-3 transition-colors lg:px-6',
        isLight
          ? 'border-b border-gray-200 bg-white shadow-xs'
          : 'border-b border-gray-800/50 bg-[#0B1120]',
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section: Sidebar Trigger & Breadcrumbs / Status */}
        <div className="flex items-center gap-3">
          <SidebarTrigger
            className={cn(
              'h-9 w-9 cursor-pointer rounded-lg transition-colors',
              isLight
                ? 'border border-gray-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
            )}
          />

          {/* Driver Cockpit Online Badge & Radar Active */}
          {isDriver && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span>ONLINE</span>
              </div>
              <div className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 sm:flex">
                <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                <span className="font-bold text-slate-700">RADAR ACTIVE</span>
              </div>
            </div>
          )}

          {/* Non-patient & non-driver breadcrumbs */}
          {!isLight && <DynamicBreadcrumb />}
        </div>

        {/* Center Section: Search Bar */}
        {isPatient && (
          <div className="mx-2 hidden max-w-md flex-1 sm:block">
            <div className="relative flex items-center">
              <Search
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search for medical records..."
                className="h-10 w-full rounded-xl border border-gray-200 bg-slate-50/70 pr-4 pl-10 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {isSuperAdmin && (
          <div className="mx-2 hidden max-w-lg flex-1 items-center gap-4 sm:flex">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, ID or license..."
                className="h-10 w-full rounded-xl border border-gray-200 bg-slate-50/80 pr-4 pl-10 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Verification Queue Live</span>
            </div>
          </div>
        )}

        {/* Right Section: Actions */}
        <RightSection role={role} />
      </div>
    </header>
  );
}
