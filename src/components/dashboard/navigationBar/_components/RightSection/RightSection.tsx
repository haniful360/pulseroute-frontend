'use client';

import { roleTypes } from '@/components/dashboard/sidebar/sidebarRoutes';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/context/ModalContext';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const UserDropdown = dynamic(() => import('./UserDropdown/UserDropdown'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-3 rounded-md border-white/5 md:border md:bg-[#0F1A2C] md:px-3 md:py-1.5">
      <Skeleton className="size-10 rounded-full bg-white/10 md:size-9" />
      <div className="hidden flex-col items-start gap-1.5 md:flex">
        <Skeleton className="h-3.5 w-20 rounded bg-white/10" />
        <Skeleton className="h-2.5 w-14 rounded bg-white/10" />
      </div>
      <ChevronDown className="text-gray/30 hidden h-4 w-4 animate-pulse md:block" />
    </div>
  ),
});

const notificationsData = [
  {
    id: 1,
    title: 'Emergency Dispatch',
    desc: 'Ambulance #AMB-042 dispatched to Mirpur-10 — ETA 6 min.',
    time: '1 min ago',
    icon: <AlertTriangle size={15} />,
    color: 'bg-red-500',
    unread: true,
  },
  {
    id: 2,
    title: 'Driver KYC Approved',
    desc: "Ariful Islam's KYC documents verified successfully.",
    time: '8 min ago',
    icon: <ShieldCheck size={15} />,
    color: 'bg-emerald-500',
    unread: true,
  },
  {
    id: 3,
    title: 'Trip Completed',
    desc: 'Patient Rakibul delivered to Dhaka Medical — Trip #T-2891.',
    time: '22 min ago',
    icon: <CheckCircle2 size={15} />,
    color: 'bg-blue-500',
    unread: true,
  },
  {
    id: 4,
    title: 'New Booking Request',
    desc: 'Urgent ambulance requested from Uttara Sector-7.',
    time: '35 min ago',
    icon: <MapPin size={15} />,
    color: 'bg-orange-500',
    unread: false,
  },
  {
    id: 5,
    title: 'System Alert',
    desc: 'GPS signal lost for driver Karim Hossain — last seen Badda.',
    time: '1h ago',
    icon: <X size={15} />,
    color: 'bg-slate-500',
    unread: false,
  },
];

function RightSection({ role }: { role: roleTypes }) {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions'>('all');
  const [notifications, setNotifications] = useState(notificationsData);

  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin';
  const isLight = isPatient || isDriver || isSuperAdmin || isAdmin;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return item.unread;
    return true;
  });

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={
              isLight
                ? 'relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-slate-50/80 text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900'
                : 'text-gray flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-800 bg-[#161F2F]/50 transition-all hover:bg-[#161F2F] hover:text-white'
            }
          >
            <Bell size={isLight ? 18 : 20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#E63946] px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            'z-100 w-84 overflow-hidden rounded-2xl p-0 shadow-2xl duration-200 sm:w-96',
            isLight
              ? 'border border-slate-200/80 bg-white text-slate-800'
              : 'border border-[#1E293B] bg-[#111827] text-white shadow-xl',
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'flex items-center justify-between border-b px-4 py-3.5',
              isLight ? 'border-slate-100 bg-white' : 'border-[#1E293B] bg-[#111827]',
            )}
          >
            <div className="flex items-center gap-2.5">
              <h2
                className={cn(
                  'text-base font-bold tracking-tight',
                  isLight ? 'text-slate-900' : 'text-white',
                )}
              >
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] leading-none font-bold',
                    isLight
                      ? 'border border-red-100 bg-red-50 text-[#E63946]'
                      : 'bg-primary/20 text-primary',
                  )}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className={cn(
                  'cursor-pointer text-xs font-semibold transition-colors',
                  isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'cursor-pointer rounded-lg p-1 transition-colors',
                  isLight
                    ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                    : 'text-slate-400 hover:bg-[#1E293B] hover:text-white',
                )}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={cn(
              'flex gap-2 border-b px-4 py-2.5',
              isLight ? 'border-slate-100 bg-slate-50/60' : 'border-[#1E293B] bg-[#161F2F]/40',
            )}
          >
            {(['all', 'unread', 'mentions'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold capitalize transition-all duration-200',
                  activeTab === tab
                    ? isLight
                      ? 'bg-[#E63946] text-white shadow-xs'
                      : 'bg-primary text-white'
                    : isLight
                      ? 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isLight ? 'text-slate-400' : 'text-slate-500',
                  )}
                >
                  No {activeTab === 'unread' ? 'unread ' : ''}notifications
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
                    );
                  }}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 border-b p-3.5 transition-colors',
                    isLight
                      ? cn(
                          'border-slate-100 hover:bg-slate-50/80',
                          item.unread ? 'bg-red-50/20' : 'bg-white',
                        )
                      : cn(
                          'border-[#1E293B] hover:bg-[#1A2234]',
                          item.unread ? 'bg-[#151D2C]' : 'bg-transparent',
                        ),
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs',
                      item.color,
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          'truncate text-sm font-semibold',
                          isLight ? 'text-slate-900' : 'text-white',
                        )}
                      >
                        {item.title}
                      </p>
                      {item.unread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#E63946]" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'mt-0.5 line-clamp-2 text-xs leading-relaxed',
                        isLight ? 'text-slate-600' : 'text-slate-300',
                      )}
                    >
                      {item.desc}
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-[11px] font-medium',
                        isLight ? 'text-slate-400' : 'text-slate-500',
                      )}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className={cn(
              'flex cursor-pointer items-center justify-center gap-1.5 border-t p-3 text-center text-xs font-semibold transition-colors',
              isLight
                ? 'border-slate-100 bg-slate-50/50 text-[#E63946] hover:bg-slate-100/80 hover:text-red-700'
                : 'text-primary border-[#1E293B] bg-[#111827] hover:text-blue-300',
            )}
          >
            View all notifications <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {role === 'admin' && (
        <DynamicActionButton
          className="h-10!"
          label="New Alert"
          showIcon
          onClick={() => openModal({ view: 'NEW_ALERT', title: 'New Alert' })}
        />
      )}
      {isPatient && <div className="mx-1 hidden h-8 w-px bg-gray-200 md:block" />}
      <UserDropdown role={role} />
    </div>
  );
}

export default RightSection;
