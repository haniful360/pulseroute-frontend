'use client';

import PulseRouteLogo from '@/components/shared/Logo/PulseRouteLogo';
import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { roleTypes } from '../../sidebarRoutes';

function SidebarHeaderSection({ role }: { role: roleTypes }) {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';
  const isLight = role === 'patient' || role === 'driver';

  return (
    <SidebarHeader className={`flex flex-col items-center gap-4 px-4 ${isLight ? 'mt-4' : 'mt-6'}`}>
      {/* PulseRoute Logo */}
      <div className="flex items-center justify-center">
        {isExpanded ? (
          <div className="flex flex-col items-start">
            <PulseRouteLogo isDark={!isLight} />
            {role === 'driver' && (
              <span className="mt-0.5 text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
                DRIVER COCKPIT
              </span>
            )}
          </div>
        ) : (
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md shadow-red-500/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        )}
      </div>
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
