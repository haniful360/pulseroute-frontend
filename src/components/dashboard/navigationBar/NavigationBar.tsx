'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { roleTypes } from '../sidebar/sidebarRoutes';
import { DynamicBreadcrumb } from './_components/DynamicBreadcrumb/DynamicBreadcrumb';
import RightSection from './_components/RightSection/RightSection';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NavigationBar({ role }: { role: roleTypes }) {
  const isPatient = role === 'patient';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full shrink-0 items-center px-4 py-3 transition-colors lg:px-6',
        isPatient
          ? 'border-b border-gray-200 bg-white shadow-xs'
          : 'border-b border-gray-800/50 bg-[#0B1120]',
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section: Sidebar Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <SidebarTrigger
            className={cn(
              'h-9 w-9 cursor-pointer rounded-lg transition-colors',
              isPatient
                ? 'border border-gray-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
            )}
          />
          {!isPatient && <DynamicBreadcrumb />}
        </div>

        {/* Center Section: Search Bar (Figma Medical Records Search) */}
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

        {/* Right Section: Actions */}
        <RightSection role={role} />
      </div>
    </header>
  );
}
