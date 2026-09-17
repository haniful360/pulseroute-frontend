'use client';

import GradientWrapper from '@/components/dashboard/GradientWrapper/GradientWrapper';
import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { roleTypes } from '../../sidebarRoutes';

export default function SidebarFooterSection({ role }: { role: roleTypes }) {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  // Allowed dynamic roles validation matrix tracking
  const allowedClients: roleTypes[] = ['enterprise', 'sarah', 'student', 'noah', 'marcus'];
  const shouldShowUpgrade = allowedClients.includes(role);
  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isLight = isPatient || isDriver;

  return (
    <SidebarFooter
      className={cn(
        'transition-all duration-300',
        isExpanded ? 'p-4' : 'p-2',
        isLight ? 'border-t border-gray-100 bg-white' : 'border-t border-[#1E293B] bg-[#0B1120]',
      )}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          {isDriver && (
            <div>
              {isExpanded ? (
                <div className="relative overflow-hidden rounded-2xl bg-[#0B132B] p-4 text-white shadow-md">
                  <span className="text-[11px] font-bold tracking-wider text-[#E63946] uppercase">
                    EMERGENCY PROTOCOL
                  </span>
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <svg
                      className="h-4 w-4 shrink-0 text-[#E63946]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Response time target: &lt; 8 mins</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B132B] text-[#E63946] shadow-sm">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div className="invisible absolute left-12 z-50 rounded-md border border-gray-700 bg-[#0B132B] px-2.5 py-1 text-xs whitespace-nowrap text-white group-hover:visible">
                      Target: &lt; 8 mins
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isSuperAdmin && (
            <div className="flex w-full flex-col gap-1">
              <Link
                href="/dashboard/super-admin/announcements"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-[#1E293B]/60 hover:text-white"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m3 11 18-5v12L3 14v-3z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                </svg>
                {isExpanded && <span>Announcements</span>}
              </Link>
              <Link
                href="/dashboard/super-admin/settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-[#1E293B]/60 hover:text-white"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {isExpanded && <span>Settings</span>}
              </Link>
            </div>
          )}
          {isPatient && (
            <div>
              {isExpanded ? (
                <div className="relative overflow-hidden rounded-2xl bg-[#0B132B] p-4 text-white shadow-md">
                  {/* Subtle watermark pulse in background */}
                  <div className="pointer-events-none absolute -right-3 -bottom-3 text-red-500/15">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <span className="text-[11px] font-bold tracking-wider text-[#E63946] uppercase">
                      LIVE TRACKING
                    </span>
                    <p className="mt-1.5 text-xs leading-relaxed font-medium text-slate-200">
                      Stay calm. Your medical crew is highly trained.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B132B] text-[#E63946] shadow-sm">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <div className="invisible absolute left-12 z-50 rounded-md border border-gray-700 bg-[#0B132B] px-2.5 py-1 text-xs whitespace-nowrap text-white group-hover:visible">
                      Live Tracking Active
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {shouldShowUpgrade && (
            <div>
              {isExpanded ? (
                <GradientWrapper
                  color="yellow"
                  innerClassName="relative z-10 flex flex-col items-center p-3 text-center py-5"
                >
                  {/* Crown Icon */}
                  <div className="relative mb-3.5 animate-bounce">
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md" />
                    <Crown
                      className="relative h-10 w-10 text-[#FBBF24]"
                      fill="#FBBF24"
                      fillOpacity={0.2}
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white">Upgrade to Pro</h2>
                    <p className="text-sm leading-tight text-white/90">
                      Unlock all premium features and components.
                    </p>
                  </div>

                  <Link
                    href={'/plan'}
                    className="group mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#3B82F6] to-[#8B5CF6] text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:opacity-90 active:scale-95"
                  >
                    Upgrade Now
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </GradientWrapper>
              ) : (
                /* --- Collapsed State: Minimal Crown Icon --- */
                <div className="flex flex-col items-center justify-center gap-2">
                  <button className="group relative flex h-10 w-10 animate-bounce cursor-pointer items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 transition-all">
                    <Crown className="h-5 w-5 text-[#FBBF24]" fill="#FBBF24" fillOpacity={0.2} />

                    {/* Tooltip logic */}
                    <div className="invisible absolute left-12 z-50 rounded-md border border-white/10 bg-[#0B1222] px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:visible">
                      Upgrade to Premium
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
