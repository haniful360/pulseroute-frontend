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
import { ChevronDown, LogOut } from 'lucide-react';
import { roleTypes } from '@/components/dashboard/sidebar/sidebarRoutes';
import { cn } from '@/lib/utils';
import { useSyncExternalStore } from 'react';

interface UserDropdownProps {
  role?: roleTypes;
}

interface UserData {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  avatarUrl?: string;
}

function subscribeUser(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getUserSnapshot(): string | null {
  try {
    return localStorage.getItem('user');
  } catch {
    return null;
  }
}

function getServerUserSnapshot(): string | null {
  return null;
}

export default function UserDropdown({ role }: UserDropdownProps) {
  const logout = useLogout();
  const userJson = useSyncExternalStore(subscribeUser, getUserSnapshot, getServerUserSnapshot);

  let user: UserData | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    logout();
  };

  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isLight = isPatient || isDriver || isSuperAdmin;

  let fallbackName = 'Admin User';
  let fallbackSubtitle = 'Emergency Dispatch';
  let fallbackAvatar: string | undefined = undefined;
  let fallbackEmail = 'admin@pulseroute.com';

  if (isPatient) {
    fallbackName = 'Rashida Khatun';
    fallbackSubtitle = 'Dhanmondi, Dhaka';
    fallbackAvatar = '/assets/dashboard/patient/rashida-khatun.png';
    fallbackEmail = 'rashida@pulseroute.com';
  } else if (isDriver) {
    fallbackName = 'Capt. Ariful Islam';
    fallbackSubtitle = 'Advanced Paramedic • DH-102';
    fallbackAvatar = '/assets/dashboard/driver/capt_ariful_avatar.png';
    fallbackEmail = 'ariful.paramedic@pulseroute.com';
  } else if (isSuperAdmin) {
    fallbackName = 'Rahat Mahmud';
    fallbackSubtitle = 'Super Admin Executive';
    fallbackAvatar = '/assets/dashboard/super-admin/rahat_admin_avatar.png';
    fallbackEmail = 'rahat.admin@pulseroute.com';
  }

  const displayName =
    user?.fullName ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    fallbackName;
  const displaySubtitle = isPatient && user?.address ? user.address : fallbackSubtitle;
  const displayAvatar = user?.avatarUrl || fallbackAvatar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'group flex cursor-pointer items-center gap-3 outline-0! transition-all duration-300',
            isLight
              ? 'rounded-xl border border-gray-200/80 bg-slate-50/50 p-1.5 hover:bg-slate-100 md:px-3 md:py-1.5'
              : 'rounded-md border-white/5 hover:bg-[#111B33]/80 md:border md:bg-[#0F1A2C] md:px-3 md:py-1.5',
          )}
        >
          <div className="hidden flex-col items-end text-left md:flex">
            <span
              className={cn(
                'text-sm leading-tight font-bold',
                isLight ? 'text-slate-900' : 'text-white',
              )}
            >
              {displayName}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium',
                isLight
                  ? 'text-slate-500'
                  : 'text-gray mt-1 text-[10px] font-semibold tracking-widest uppercase',
              )}
            >
              {displaySubtitle}
            </span>
          </div>

          <Avatar className="size-10 border border-gray-200 transition-all duration-300 md:size-9.5">
            {displayAvatar && (
              <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
            )}
            <AvatarFallback className="bg-[#E63946] text-xs font-bold text-white">
              {displayName ? displayName.substring(0, 2).toUpperCase() : 'PR'}
            </AvatarFallback>
          </Avatar>

          <ChevronDown
            className={cn(
              'hidden h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 md:block',
              isLight ? 'text-slate-400' : 'text-gray',
            )}
          />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Menu Content */}
      <DropdownMenuContent
        className={cn(
          'z-100 w-64 rounded-xl p-2 shadow-xl duration-200',
          isLight
            ? 'border-gray-200 bg-white text-slate-800'
            : 'border-white/10 bg-[#0F1A2C] text-white backdrop-blur-xl',
        )}
        align="end"
        sideOffset={10}
      >
        <DropdownMenuLabel>
          <p
            className={cn(
              'text-xs font-semibold tracking-[0.15em] uppercase',
              isLight ? 'text-slate-500' : 'text-gray',
            )}
          >
            Manage Profile
          </p>
          <p className={cn('mt-0.5 text-sm', isLight ? 'text-slate-700' : 'text-gray')}>
            {user?.email || fallbackEmail}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className={isLight ? 'bg-gray-100' : 'bg-white/5'} />

        <div>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-all outline-none hover:bg-red-50 hover:text-red-700 focus:bg-red-50 active:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout Account
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
