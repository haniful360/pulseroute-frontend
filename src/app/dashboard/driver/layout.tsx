'use client';

import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function DriverDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        {/* Driver Light Sidebar */}
        <AppSidebar role="driver" />

        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 min-w-0 w-full flex-col bg-[#F8FAFC] overflow-x-hidden">
          {/* Driver Navigation Bar */}
          <NavigationBar role="driver" />

          {/* Page Content */}
          <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl min-w-0">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
