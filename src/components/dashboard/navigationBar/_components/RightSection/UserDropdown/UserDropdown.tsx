'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/useLogout';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetMyProfileQuery } from '@/redux/features/getUser/getUserMeApi';
import { useAppSelector } from '@/redux/hooks';
import { ChevronDown, LogOut } from 'lucide-react';
import { roleTypes } from '@/components/dashboard/sidebar/sidebarRoutes';

interface UserDropdownProps {
  role?: roleTypes;
}

export default function UserDropdown({ role }: UserDropdownProps) {
  const currentUser = useAppSelector(useCurrentUser);
  const logout = useLogout();

  // Fetch real-time profile info from the server (/users/me)
  const { data: profileResponse, isLoading } = useGetMyProfileQuery(undefined, {
    skip: !currentUser,
  });

  const handleLogout = () => {
    logout();
  };

  // Merge currentUser (session data) and profileResponse (detailed DB profile data)
  const profile = profileResponse?.data || currentUser;

  const avatarUrl = profile?.avatarUrl || profile?.profilePicture;
  const fullName =
    profile?.fullName ||
    (profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : '');
  const email = profile?.email;

  const roleDisplay = (() => {
    const rawRole = profile?.role || profile?.roles?.[0];
    if (!rawRole) return '';
    return rawRole
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  })();

  const planTitle =
    profile?.purchaseInfo?.plan?.name ||
    profile?.purchaseInfo?.plan?.title ||
    profile?.plan?.name ||
    profile?.plan?.title ||
    profile?.planName ||
    profile?.subscription?.plan?.name ||
    'Free Plan';

  const isAdmin =
    role === 'admin' ||
    profile?.role === 'ADMIN' ||
    profile?.role === 'SUPER_ADMIN' ||
    profile?.roles?.includes('ADMIN') ||
    profile?.roles?.includes('SUPER_ADMIN');

  const subtitleDisplay = isAdmin ? roleDisplay : planTitle;

  // Render Skeleton Loader during hydration or initial load if profile data is missing
  if (isLoading && !fullName) {
    return (
      <div className="flex items-center gap-3 rounded-md border-white/5 md:border md:bg-[#0F1A2C] md:px-3 md:py-1.5">
        <Skeleton className="size-10 rounded-full bg-white/10 md:size-9" />
        <div className="hidden flex-col items-start gap-1.5 md:flex">
          <Skeleton className="h-3.5 w-20 rounded bg-white/10" />
          <Skeleton className="h-2.5 w-14 rounded bg-white/10" />
        </div>
        <ChevronDown className="text-gray/30 hidden h-4 w-4 animate-pulse md:block" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex cursor-pointer items-center gap-3 rounded-md border-white/5 outline-0! transition-all duration-300 hover:bg-[#111B33]/80 md:border md:bg-[#0F1A2C] md:px-3 md:py-1.5">
          <Avatar className="size-10 border transition-all duration-300 md:size-9">
            {avatarUrl && (
              <AvatarImage
                src={avatarUrl}
                alt={fullName || 'User Avatar'}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-primary text-xs font-semibold text-white">
              {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm leading-none font-semibold text-white">
              {fullName || 'User'}
            </span>
            <span className="text-gray mt-1 text-[10px] font-semibold tracking-widest uppercase">
              {subtitleDisplay}
            </span>
          </div>
          <ChevronDown className="text-gray hidden h-4 w-4 md:block" />
        </button>
      </DropdownMenuTrigger>
      {/* Dropdown Menu Content */}
      <DropdownMenuContent
        className="rounded-ms animate-in fade-in zoom-in-95 z-100 w-64 border-white/10 bg-[#0F1A2C] p-2 shadow-xl backdrop-blur-xl duration-200"
        align="end"
        sideOffset={10}
      >
        <DropdownMenuLabel>
          <p className="text-gray text-xs font-semibold tracking-[0.2em] uppercase">
            Manage Profile
          </p>
          <p className="text-gray mt-0.5 text-sm">{email || currentUser?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5" />

        <div>
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-error hover:bg-error/10 focus:bg-error/10 hover:text-error! active:text-error! flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition-all outline-none"
          >
            <LogOut className="h-4 w-4" />
            Logout Account
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
