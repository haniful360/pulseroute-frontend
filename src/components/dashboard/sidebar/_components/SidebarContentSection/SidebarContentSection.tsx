/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  AdminRoutes,
  enterpriseRoutes,
  marcusRoutes,
  noahRoutes,
  patientRoutes,
  roleTypes,
  sarahRoutes,
  sarahTeamMemberRoutes,
  studentRoutes,
} from '../../sidebarRoutes';

function SidebarContentSection({ role }: { role: roleTypes }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state } = useSidebar();

  const roleBaseRoutes: Record<roleTypes, any[]> = {
    patient: patientRoutes,
    driver: [],
    admin: AdminRoutes,
    'super-admin': AdminRoutes,
    enterprise: enterpriseRoutes,
    sarah: sarahRoutes,
    'sarah-team-member': sarahTeamMemberRoutes,
    student: studentRoutes(false),
    noah: noahRoutes(false),
    marcus: marcusRoutes,
  };

  const menuItems = roleBaseRoutes[role] || [];
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    menuItems.forEach((item: any) => {
      if (item?.items?.length) {
        const isChildActive = item.items.some(
          (sub: any) => pathname === sub.url || pathname.startsWith(sub.url),
        );
        if (isChildActive || pathname === item.url) {
          setOpenMenus((prev) => ({ ...prev, [item.title]: true }));
        }
      }
    });
  }, [pathname, menuItems]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isPatient = role === 'patient';

  return (
    <SidebarContent
      className={`${state === 'expanded' ? 'px-4' : 'ps-4'} no-scrollbar pt-3 ${isPatient ? 'bg-white' : ''}`}
    >
      {isPatient && state === 'expanded' && (
        <div className="px-5 pt-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Main Menu
        </div>
      )}
      <SidebarMenu className="gap-2">
        {menuItems.map((item: any) => {
          const hasSubItems = Boolean(item?.items && item?.items.length > 0);
          const isChildActive =
            hasSubItems &&
            item.items.some((sub: any) => pathname === sub.url || pathname.startsWith(sub.url));
          const isMedicalActive =
            item?.url?.includes('medical-profile') &&
            (pathname === '/dashboard/patient' ||
              pathname.startsWith('/dashboard/patient/medical-profile'));
          const isActive =
            pathname === item?.url ||
            (item?.url && item?.url !== '/' && pathname.startsWith(item?.url + '/')) ||
            isChildActive ||
            isMedicalActive;
          const Icon = item?.icon;
          const isOpen = Boolean(openMenus[item?.title]);

          if (hasSubItems) {
            return (
              <SidebarMenuItem key={item?.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={state === 'collapsed' ? item?.title : undefined}
                  className="gap-3.5 px-5 py-6 font-medium transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleMenu(item?.title)}
                    className={`flex w-full cursor-pointer items-center justify-between font-medium transition-all duration-300 ${
                      isPatient
                        ? isActive
                          ? 'border-l-4 border-[#E63946] bg-[#FEF2F2] font-semibold text-[#0B132B]'
                          : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0B132B]'
                        : isActive
                          ? 'text-primary! bg-[#1E293B]!'
                          : 'hover:text-primary! text-[#F8FAFC]! hover:bg-[#1E293B]/40!'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {Icon && (
                        <Icon
                          className={
                            isPatient ? (isActive ? 'text-[#06D6A0]' : 'text-[#64748B]') : ''
                          }
                        />
                      )}
                      <span className={`${state === 'collapsed' ? 'hidden' : 'block'}`}>
                        {item?.title}
                      </span>
                    </div>
                    {state !== 'collapsed' && (
                      <span
                        className={
                          isPatient ? 'ml-auto text-slate-400' : 'ml-auto text-[#F8FAFC]/70'
                        }
                      >
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </span>
                    )}
                  </button>
                </SidebarMenuButton>

                {isOpen && state !== 'collapsed' && (
                  <div className="relative mt-2 mb-1 ml-7.5 flex flex-col gap-2.5 pl-5.5">
                    {(() => {
                      const activeIndex = item.items.findIndex(
                        (sub: any) => pathname === sub.url || pathname.startsWith(sub.url),
                      );

                      const itemHeight = 44;
                      const itemGap = 10;
                      const totalHeight =
                        item.items.length * itemHeight + (item.items.length - 1) * itemGap;

                      return (
                        <>
                          {/* SVG Connector Tree Lines */}
                          <svg
                            className="pointer-events-none absolute top-0 left-0 z-10 w-6"
                            style={{ height: `${totalHeight}px` }}
                            viewBox={`0 0 24 ${totalHeight}`}
                            fill="none"
                          >
                            {item.items.map((_: any, index: number) => {
                              const centerY = index * (itemHeight + itemGap) + itemHeight / 2;
                              const prevY =
                                index === 0
                                  ? 0
                                  : (index - 1) * (itemHeight + itemGap) + itemHeight / 2;
                              const d = `M 1 ${prevY} L 1 ${
                                centerY - 10
                              } Q 1 ${centerY} 11 ${centerY} L 22 ${centerY}`;
                              const isBranchActive = activeIndex !== -1 && index <= activeIndex;

                              return (
                                <path
                                  key={index}
                                  d={d}
                                  fill="none"
                                  stroke={isBranchActive ? '#3884F6' : '#334155'}
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-colors duration-200"
                                />
                              );
                            })}
                          </svg>

                          {item.items.map((sub: any) => {
                            const isSubActive =
                              pathname === sub.url || pathname.startsWith(sub.url);

                            return (
                              <div key={sub.title} className="relative">
                                <Link
                                  href={sub.url}
                                  onClick={() => isMobile && setOpenMobile(false)}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isSubActive
                                      ? 'bg-[#1E293B] font-semibold text-[#3884F6]'
                                      : 'bg-[#1E293B]/70 text-[#F8FAFC] hover:bg-[#1E293B] hover:text-[#3884F6]'
                                  }`}
                                >
                                  <span>{sub.title}</span>
                                </Link>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                )}
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item?.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={state === 'collapsed' ? item?.title : undefined}
                className={`gap-3.5 px-5 py-5.5 font-medium transition-all duration-200 ${
                  isPatient
                    ? isActive
                      ? 'rounded-l-none rounded-r-xl border-l-4 border-[#E63946] bg-[#FEF2F2] font-semibold text-[#0B132B]'
                      : 'rounded-xl text-[#64748B] hover:bg-slate-50 hover:text-[#0B132B]'
                    : ''
                }`}
              >
                <Link
                  href={item?.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className={`flex items-center gap-3.5 font-medium transition-all duration-300 ${
                    isPatient
                      ? isActive
                        ? 'font-semibold text-[#0B132B]'
                        : 'text-[#64748B] hover:text-[#0B132B]'
                      : isActive
                        ? 'text-primary! bg-[#1E293B]!'
                        : 'hover:text-primary! text-[#F8FAFC]! hover:bg-[#1E293B]/40!'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={
                        isPatient
                          ? isActive
                            ? item.title === 'Medical Profile'
                              ? 'text-[#06D6A0]'
                              : 'text-[#E63946]'
                            : 'text-[#64748B]'
                          : ''
                      }
                      size={20}
                    />
                  )}
                  <span className={`${state === 'collapsed' ? 'hidden' : 'block'}`}>
                    {item?.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>
  );
}

export default SidebarContentSection;
