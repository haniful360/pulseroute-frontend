'use client';

import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-[#F9FAFB]">
        {/* Patient Sidebar */}
        <AppSidebar role="patient" />

        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 min-w-0 w-full flex-col bg-[#F9FAFB] overflow-x-hidden">
          {/* Patient Top Navigation Bar */}
          <NavigationBar role="patient" />

          {/* Page Content */}
          <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl min-w-0">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
