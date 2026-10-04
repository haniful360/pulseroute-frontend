'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { roleTypes } from '../sidebar/sidebarRoutes';
import { DynamicBreadcrumb } from './_components/DynamicBreadcrumb/DynamicBreadcrumb';
import RightSection from './_components/RightSection/RightSection';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NavigationBar({ role }: { role: roleTypes }) {
  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin';
  const isLight = isPatient || isDriver || isSuperAdmin || isAdmin;

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
          {!isPatient && !isDriver && <DynamicBreadcrumb />}
        </div>

        {/* Center Section: Search Bar */}
        {isPatient && (
          <div className="mx-2 hidden max-w-md flex-1 sm:block">
            <InputField
              placeholder="Search for medical records..."
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        )}

        {isSuperAdmin && (
          <div className="mx-2 hidden max-w-lg flex-1 items-center gap-4 sm:flex">
            <div className="flex-1">
              <InputField
                placeholder="Search by name, ID or license..."
                icon={<Search className="h-4 w-4 text-slate-400" />}
              />
            </div>
          </div>
        )}

        {/* Right Section: Actions */}
        <RightSection role={role} />
      </div>
    </header>
  );
}
