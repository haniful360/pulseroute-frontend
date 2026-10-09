'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavUserDropdown: React.FC = () => {
  const router = useRouter();
  const { user, role, logout } = useAuth();

  let unreadCount = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const notificationContext = useNotifications();
    unreadCount = notificationContext.unreadCount || 0;
  } catch {
    unreadCount = 0;
  }

  if (!user) return null;

  const userRole = (role as string)?.toUpperCase();
  const isDriver = userRole === 'DRIVER';
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  // Role-based destination URLs
  const dashboardUrl = isDriver
    ? '/dashboard/driver'
    : isSuperAdmin
    ? '/dashboard/super-admin/overview'
    : '/dashboard/patient';

  const profileUrl = isDriver
    ? '/dashboard/driver/ambulance-profile'
    : isSuperAdmin
    ? '/dashboard/super-admin/settings'
    : '/dashboard/patient/settings';

  const settingsUrl = isDriver
    ? '/dashboard/driver/settings'
    : isSuperAdmin
    ? '/dashboard/super-admin/settings'
    : '/dashboard/patient/settings';

  const notificationsUrl = isDriver
    ? '/dashboard/driver/notifications'
    : isSuperAdmin
    ? '/dashboard/super-admin/announcements'
    : '/dashboard/patient/notifications';

  const profileLabel = isDriver
    ? 'Ambulance Profile'
    : isSuperAdmin
    ? 'Profile & Account'
    : 'Profile & Settings';

  const displayName = user.name || 'Account';
  const displayEmail = user.email || '';
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'PR';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out cleanly');
      router.push('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="User navigation menu"
          className="group relative flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/25"
        >
          {/* Avatar with online status */}
          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-slate-200/90 shadow-xs transition-colors group-hover:border-red-500">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={displayName} className="object-cover" />
              )}
              <AvatarFallback className="bg-red-600 text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-68 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl shadow-slate-900/12 animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        {/* Top Profile Summary Card */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-slate-100/60 p-3">
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 border-2 border-white shadow-xs">
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={displayName} className="object-cover" />
                )}
                <AvatarFallback className="bg-red-600 text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
              <p className="truncate text-xs font-medium text-slate-500">{displayEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Dropdown Options */}
        <div className="mt-2 space-y-0.5">
          {/* Dashboard */}
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
              href={dashboardUrl}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                </div>
                <span>Dashboard</span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Profile */}
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
              href={profileUrl}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span>{profileLabel}</span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Notifications */}
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
              href={notificationsUrl}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
              href={settingsUrl}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Settings className="h-3.5 w-3.5" />
                </div>
                <span>Settings</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

        {/* Logout Action */}
        <div className="p-0.5">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <LogOut className="h-3.5 w-3.5" />
            </div>
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserDropdown;
