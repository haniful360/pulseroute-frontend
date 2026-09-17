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

  return (
    <SidebarFooter
      className={cn(
        'transition-all duration-300',
        isExpanded ? 'p-4' : 'p-2',
        isPatient && 'border-t border-gray-100 bg-white',
      )}
    >
      <SidebarMenu>
        <SidebarMenuItem>
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
