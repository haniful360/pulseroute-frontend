'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import * as React from 'react';
import SidebarContentSection from './_components/SidebarContentSection/SidebarContentSection';
import SidebarFooterSection from './_components/SidebarFooterSection/SidebarFooterSection';
import SidebarHeaderSection from './_components/SidebarHeader/SidebarHeader';
import { roleTypes } from './sidebarRoutes';

export function AppSidebar({
  role = 'admin',
  className,
  ...props
}: { role: roleTypes } & React.ComponentProps<typeof Sidebar>) {
  const isLight = role === 'patient' || role === 'driver';
  const isSuperAdmin = role === 'super-admin';

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        isLight && 'border-r border-gray-200 bg-white text-slate-800',
        isSuperAdmin && 'border-r border-[#1E293B] bg-[#0B1120] text-slate-200',
        className,
      )}
      {...props}
    >
      <SidebarHeaderSection role={role} />
      <SidebarContentSection role={role} />
      <SidebarFooterSection role={role} />
    </Sidebar>
  );
}
