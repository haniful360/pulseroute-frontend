'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { roleTypes } from '../sidebar/sidebarRoutes';
import { DynamicBreadcrumb } from './_components/DynamicBreadcrumb/DynamicBreadcrumb';
import RightSection from './_components/RightSection/RightSection';

export default function NavigationBar({ role }: { role: roleTypes }) {
  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 items-center border-b border-gray-800/50 bg-[#0B1120] px-4 py-3.5 lg:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section: Sidebar Trigger & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary h-9 w-9 cursor-pointer rounded-md transition-colors" />
          <DynamicBreadcrumb />
        </div>

        {/* Center Section: Search Bar */}
        {/* <div className="mx-4 hidden max-w-xl flex-1 md:block">
          <div className="group relative">
            <Search
              className="text-secondary absolute top-1/2 left-3 -translate-y-1/2 transition-colors group-focus-within:text-blue-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-gray-800 bg-[#161F2F]/50 py-2.5 pr-16 pl-10 text-sm text-gray-300 transition-all focus:border-blue-500/50 focus:bg-[#161F2F] focus:outline-none"
            />
          </div>
        </div> */}

        {/* Right Section: Actions */}
        <RightSection role={role} />
      </div>
    </header>
  );
}
