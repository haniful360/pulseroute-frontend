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
  const isPatient = role === 'patient';

  return (
    <Sidebar
      collapsible="icon"
      className={cn(isPatient && 'border-r border-gray-200 bg-white text-slate-800', className)}
      {...props}
    >
      <SidebarHeaderSection role={role} />
      <SidebarContentSection role={role} />
      <SidebarFooterSection role={role} />
    </Sidebar>
  );
}
