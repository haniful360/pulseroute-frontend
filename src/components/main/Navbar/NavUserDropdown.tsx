'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Activity,
  Ambulance,
  ArrowRight,
  Bell,
  ChevronDown,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Navigation,
  Radio,
  Route,
  Settings,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Wallet,
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
  const isPatient = userRole === 'USER' || userRole === 'PATIENT';
  const isDriver = userRole === 'DRIVER';
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  // Role Configuration
  const roleConfig = (() => {
    if (isDriver) {
      return {
        roleKey: 'DRIVER',
        badgeTitle: 'Driver',
        fullTitle: 'Emergency Driver',
        subtext: 'Rapid Response Unit',
        dashboardUrl: '/dashboard/driver',
        profileUrl: '/dashboard/driver/ambulance-profile',
        settingsUrl: '/dashboard/driver/settings',
        notificationsUrl: '/dashboard/driver/notifications',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        badgeDot: 'bg-emerald-500',
        Icon: Ambulance,
        quickLinks: [
          {
            title: 'Active Dispatch',
            subtitle: 'Live emergency navigation',
            url: '/dashboard/driver/active-dispatch',
            icon: Navigation,
            color: 'text-red-600 bg-red-50',
          },
          {
            title: 'Stripe Wallet',
            subtitle: 'Earnings & payout history',
            url: '/dashboard/driver/wallet',
            icon: Wallet,
            color: 'text-emerald-600 bg-emerald-50',
          },
          {
            title: 'Ambulance Profile',
            subtitle: 'Vehicle specs & equipment',
            url: '/dashboard/driver/ambulance-profile',
            icon: Ambulance,
            color: 'text-blue-600 bg-blue-50',
          },
          {
            title: 'Shift History',
            subtitle: 'Past completed duty runs',
            url: '/dashboard/driver/shift-history',
            icon: History,
            color: 'text-amber-600 bg-amber-50',
          },
        ],
      };
    }

    if (isSuperAdmin) {
      return {
        roleKey: 'SUPER_ADMIN',
        badgeTitle: 'Super Admin',
        fullTitle: 'Super Admin',
        subtext: 'System Executive',
        dashboardUrl: '/dashboard/super-admin/overview',
        profileUrl: '/dashboard/super-admin/settings',
        settingsUrl: '/dashboard/super-admin/settings',
        notificationsUrl: '/dashboard/super-admin/announcements',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
        badgeDot: 'bg-purple-500',
        Icon: ShieldAlert,
        quickLinks: [
          {
            title: 'Live Fleet Radar',
            subtitle: 'Citywide live ambulance map',
            url: '/dashboard/super-admin/radar',
            icon: Radio,
            color: 'text-red-600 bg-red-50',
          },
          {
            title: 'Trip Management',
            subtitle: 'All dispatches & requests',
            url: '/dashboard/super-admin/trips',
            icon: Route,
            color: 'text-blue-600 bg-blue-50',
          },
          {
            title: 'Ambulance Fleet',
            subtitle: 'Certified vehicle registry',
            url: '/dashboard/super-admin/fleet',
            icon: Ambulance,
            color: 'text-emerald-600 bg-emerald-50',
          },
          {
            title: 'User Management',
            subtitle: 'Drivers, patients & staff',
            url: '/dashboard/super-admin/users',
            icon: Users,
            color: 'text-purple-600 bg-purple-50',
          },
        ],
      };
    }

    // Default: Patient (USER)
    return {
      roleKey: 'USER',
      badgeTitle: 'Patient',
      fullTitle: 'Patient Member',
      subtext: 'PulseRoute Member',
      dashboardUrl: '/dashboard/patient',
      profileUrl: '/dashboard/patient/medical-profile',
      settingsUrl: '/dashboard/patient/settings',
      notificationsUrl: '/dashboard/patient/notifications',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      badgeDot: 'bg-blue-500',
      Icon: ShieldCheck,
      quickLinks: [
        {
          title: 'Book Ambulance',
          subtitle: 'Instant dispatch request',
          url: '/dashboard/patient/book-ambulance',
          icon: Ambulance,
          color: 'text-red-600 bg-red-50',
        },
        {
          title: 'Active Trip',
          subtitle: 'Track incoming ambulance',
          url: '/dashboard/patient/active-trip',
          icon: Activity,
          color: 'text-emerald-600 bg-emerald-50',
        },
        {
          title: 'Trip History',
          subtitle: 'Past emergency dispatches',
          url: '/dashboard/patient/trip-history',
          icon: History,
          color: 'text-amber-600 bg-amber-50',
        },
        {
          title: 'Payment Methods',
          subtitle: 'Saved cards & billing',
          url: '/dashboard/patient/payment-methods',
          icon: CreditCard,
          color: 'text-blue-600 bg-blue-50',
        },
      ],
    };
  })();

  const displayName = user.name || 'Account';
  const displayEmail = user.email || '';
  const initials = displayName
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

  const RoleIcon = roleConfig.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="User navigation menu"
          className="group flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-1.5 pr-3 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          {/* Avatar with online status */}
          <div className="relative">
            <Avatar className="h-7 w-7 border border-slate-200/80 shadow-xs">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={displayName} className="object-cover" />
              )}
              <AvatarFallback className="bg-red-600 text-[11px] font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full border border-white bg-emerald-500"></span>
            </span>
          </div>

          {/* Name & Role Pill */}
          <div className="flex items-center gap-1.5 text-left">
            <span className="max-w-[110px] truncate text-xs font-semibold text-slate-800">
              {displayName}
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${roleConfig.badgeBg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${roleConfig.badgeDot}`} />
              {roleConfig.badgeTitle}
            </span>
          </div>

          {/* Dropdown Chevron */}
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xl shadow-slate-900/12 animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        {/* Top Profile Summary Card */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-slate-100/60 p-3">
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11 border-2 border-white shadow-xs">
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={displayName} className="object-cover" />
                )}
                <AvatarFallback className="bg-red-600 text-sm font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ${roleConfig.badgeBg}`}
                >
                  <RoleIcon className="h-2.5 w-2.5" />
                  {roleConfig.badgeTitle}
                </span>
              </div>
              <p className="truncate text-xs font-medium text-slate-500">{displayEmail}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {roleConfig.subtext}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Primary Action: Go to Dashboard */}
        <div className="mt-2.5">
          <Link
            href={roleConfig.dashboardUrl}
            className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-red-600/25 transition-all hover:from-red-700 hover:to-red-600 hover:shadow-md hover:shadow-red-600/30"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                <LayoutDashboard className="h-3.5 w-3.5 text-white" />
              </div>
              <span>Open {roleConfig.badgeTitle} Dashboard</span>
            </div>
            <ArrowRight className="h-4 w-4 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Role-Specific Quick Shortcuts */}
        <div className="px-1 py-0.5">
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {roleConfig.badgeTitle} Quick Access
          </p>
          <div className="space-y-0.5">
            {roleConfig.quickLinks.map((item) => {
              const ItemIcon = item.icon;
              return (
                <DropdownMenuItem key={item.url} asChild className="p-0 focus:bg-transparent">
                  <Link
                    href={item.url}
                    className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors group-hover:scale-105 ${item.color}`}
                      >
                        <ItemIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Common Account Section */}
        <div className="px-1 py-0.5">
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account & System
          </p>
          <div className="space-y-0.5">
            {/* Profile Link */}
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href={roleConfig.profileUrl}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span>
                    {isPatient ? 'Medical Profile' : isDriver ? 'Ambulance Profile' : 'Profile & Account'}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>

            {/* Notifications Link */}
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href={roleConfig.notificationsUrl}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
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

            {/* Settings Link */}
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href={roleConfig.settingsUrl}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
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
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* Logout Action */}
        <div className="p-1">
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
