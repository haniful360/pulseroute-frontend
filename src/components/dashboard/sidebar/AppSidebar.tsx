'use client';

import { Sidebar } from '@/components/ui/sidebar';
import * as React from 'react';
import SidebarContentSection from './_components/SidebarContentSection/SidebarContentSection';
import SidebarFooterSection from './_components/SidebarFooterSection/SidebarFooterSection';
import SidebarHeaderSection from './_components/SidebarHeader/SidebarHeader';
import { roleTypes } from './sidebarRoutes';

export function AppSidebar({
  role = 'admin',
  ...props
}: { role: roleTypes } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeaderSection role={role} />
      <SidebarContentSection role={role} />
      <SidebarFooterSection role={role} />
    </Sidebar>
  );
}
