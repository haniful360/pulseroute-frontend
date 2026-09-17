'use client';

import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function DriverDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        {/* Driver Light Sidebar */}
        <AppSidebar role="driver" />

        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 flex-col bg-[#F8FAFC]">
          {/* Driver Navigation Bar */}
          <NavigationBar role="driver" />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
