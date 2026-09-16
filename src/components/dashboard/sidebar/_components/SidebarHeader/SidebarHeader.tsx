/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import UserImg from '@/assets/dashboard/client/icons/student.png';
import agentArumLogo from '@/assets/main/icons/agent-arum-logo.svg';
import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetMyProfileQuery } from '@/redux/features/getUser/getUserMeApi';
import { useAppSelector } from '@/redux/hooks';

import { Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { roleTypes } from '../../sidebarRoutes';

function SidebarHeaderSection({ role }: { role: roleTypes }) {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  const currentUser = useAppSelector(useCurrentUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch real-time profile info from the server (/users/me)
  const { data: profileResponse, isLoading } = useGetMyProfileQuery(undefined, {
    skip: !currentUser,
  });

  const profile = profileResponse?.data || currentUser;
  const fullName =
    profile?.fullName ||
    (profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : '');
  const avatarUrl = profile?.avatarUrl || profile?.profilePicture;
  const planName = profile?.purchaseInfo?.plan?.name || 'Free Plan';
  const isPlanLoading = isLoading && !profileResponse && !currentUser?.purchaseInfo;

  // Allowed dynamic roles validation array tracking
  const allowedClients: roleTypes[] = [
    'enterprise',
    'sarah',
    'sarah-team-member',
    'student',
    'noah',
    'marcus',
  ];
  const shouldShowProfile = allowedClients.includes(role);

  // Render Skeleton Loader during initial load or hydration if profile name is missing
  if (shouldShowProfile && (!mounted || (isLoading && !fullName))) {
    return (
      <SidebarHeader className="mt-6 flex flex-col items-center gap-6 px-4">
        {/* Logo Section */}
        <Link href={'/'} className="flex items-center justify-center gap-2.5">
          <Image
            src={agentArumLogo}
            width={45}
            height={45}
            priority
            alt="AgentArum Logo"
            className="h-full w-full max-w-10"
          />
          {isExpanded && (
            <h4 className={`text-2xl font-bold text-nowrap text-white`}>
              Agent<span className="text-gold">Arum</span>
            </h4>
          )}
        </Link>

        <div
          className={`flex flex-col items-center transition-all duration-300 ${isExpanded ? 'w-full' : 'w-10'}`}
        >
          <div className="group relative">
            <Skeleton
              className={`${isExpanded ? 'size-18 sm:size-22' : 'size-10'} rounded-full bg-white/10`}
            />
          </div>
          {isExpanded && (
            <div className="mt-7 flex w-full flex-col items-center gap-3">
              <Skeleton className="h-5 w-32 rounded bg-white/10" />
              <div className="mt-5 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )}
        </div>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="mt-6 flex flex-col items-center gap-6 px-4">
      {/* Logo Section */}
      <Link href={'/'} className="flex items-center justify-center gap-2.5">
        <Image
          src={agentArumLogo}
          width={45}
          height={45}
          priority
          alt="AgentArum Logo"
          className="h-full w-full max-w-10"
        />
        {isExpanded && (
          <h4 className={`text-2xl font-bold text-nowrap text-white`}>
            Agent<span className="text-gold">Arum</span>
          </h4>
        )}
      </Link>

      {/* Profile Section for Client Roles Based */}
      {shouldShowProfile && (
        <div
          className={`flex flex-col items-center transition-all duration-300 ${isExpanded ? 'w-full' : 'w-10'}`}
        >
          <div className="group relative">
            {/* Gold Border Glow matching the SS */}
            <div
              className={`relative rounded-full p-0.5 transition-all duration-500 ${isExpanded ? 'bg-linear-to-b from-[#FBBF24] to-transparent shadow-[0_0_20px_rgba(251,191,36,0.2)]' : ''}`}
            >
              <div
                className={`${isExpanded ? 'size-18 sm:size-22' : 'size-10'} relative overflow-hidden rounded-full border-2 bg-[#0F1A2C]`}
              >
                {isLoading && !(profileResponse as any)?.data?.avatarUrl ? (
                  <Skeleton className="size-full bg-white/10" />
                ) : (
                  <Image
                    src={avatarUrl || UserImg}
                    alt="User Profile Image"
                    fill
                    className="object-cover object-top"
                  />
                )}
              </div>
            </div>
            {/* Plan Badge - Only visible when expanded */}
            {isExpanded && (
              <div className="absolute -bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#EAB308] px-4 py-1.5 whitespace-nowrap shadow-sm">
                <Award className="size-4 text-white" />
                {isPlanLoading ? (
                  <Skeleton className="h-3 w-16 bg-white/40" />
                ) : (
                  <span className="text-[10px] font-semibold tracking-wide text-white md:text-xs">
                    {planName}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* User Name Section */}
          {isExpanded && (
            <div className="mt-7 w-full px-4 text-center">
              <h3 className="text-xl font-semibold tracking-tight wrap-break-word text-white md:text-2xl">
                {fullName || 'User'}
              </h3>
              <div className="mt-5 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )}
        </div>
      )}
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
