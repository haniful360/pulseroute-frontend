'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { roleTypes } from '@/components/dashboard/sidebar/sidebarRoutes';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/context/ModalContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CreditCard,
  ChevronDown,
  Radio,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { INotificationItem } from '@/services/notification/notification.service';

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

function formatRelativeTime(dateString: string) {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (isNaN(diff) || diff < 0) return 'Just now';
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function getNotificationVisuals(type: string, isLight: boolean) {
  const upperType = (type || '').toUpperCase();

  switch (upperType) {
    case 'TRIP':
      return {
        icon: <Ambulance size={15} />,
        bg: 'bg-red-500',
        badgeColor: 'border-red-200 text-red-700 bg-red-50',
      };
    case 'PAYMENT':
      return {
        icon: <CreditCard size={15} />,
        bg: 'bg-emerald-500',
        badgeColor: 'border-emerald-200 text-emerald-700 bg-emerald-50',
      };
    case 'WALLET':
      return {
        icon: <Wallet size={15} />,
        bg: 'bg-amber-500',
        badgeColor: 'border-amber-200 text-amber-700 bg-amber-50',
      };
    case 'ACCOUNT':
      return {
        icon: <ShieldCheck size={15} />,
        bg: 'bg-blue-500',
        badgeColor: 'border-blue-200 text-blue-700 bg-blue-50',
      };
    case 'EMERGENCY':
      return {
        icon: <AlertTriangle size={15} />,
        bg: 'bg-red-600',
        badgeColor: 'border-red-300 text-red-800 bg-red-100',
      };
    case 'SYSTEM':
    default:
      return {
        icon: <Radio size={15} />,
        bg: isLight ? 'bg-slate-700' : 'bg-slate-600',
        badgeColor: 'border-slate-200 text-slate-700 bg-slate-50',
      };
  }
}

function RightSection({ role }: { role: roleTypes }) {
  const router = useRouter();
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'trip' | 'payment' | 'system'>('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin';
  const isLight = isPatient || isDriver || isSuperAdmin || isAdmin;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMarkingAll(true);
    await markAllAsRead();
    setIsMarkingAll(false);
  };

  const handleNotificationClick = async (item: INotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleNavigateToAll = () => {
    setIsOpen(false);
    if (isDriver) {
      router.push('/dashboard/driver/notifications');
    } else if (isSuperAdmin) {
      router.push('/dashboard/super-admin/announcements');
    } else {
      router.push('/dashboard/patient/notifications');
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'trip') return (item.type || '').toUpperCase() === 'TRIP';
    if (activeTab === 'payment') {
      const t = (item.type || '').toUpperCase();
      return t === 'PAYMENT' || t === 'WALLET';
    }
    if (activeTab === 'system') {
      const t = (item.type || '').toUpperCase();
      return t === 'SYSTEM' || t === 'ACCOUNT';
    }
    return true;
  });

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open notifications"
            className={cn(
              'relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all',
              isLight
                ? 'border border-gray-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                : 'border border-gray-800 bg-[#161F2F]/50 text-gray-300 hover:bg-[#161F2F] hover:text-white',
              unreadCount > 0 && 'ring-2 ring-red-500/20',
            )}
          >
            <Bell size={isLight ? 18 : 20} className={unreadCount > 0 ? 'text-[#E63946]' : ''} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 animate-pulse items-center justify-center rounded-full bg-[#E63946] px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            'z-100 w-84 overflow-hidden rounded-3xl p-0 shadow-2xl duration-200 sm:w-96',
            isLight
              ? 'border border-slate-200/90 bg-white text-slate-800'
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
                    'rounded-full px-2 py-0.5 text-[11px] font-bold leading-none',
                    isLight
                      ? 'border border-red-100 bg-red-50 text-[#E63946]'
                      : 'bg-red-500/20 text-red-400',
                  )}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isMarkingAll}
                  className={cn(
                    'flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors',
                    isLight
                      ? 'text-slate-500 hover:text-[#E63946]'
                      : 'text-slate-400 hover:text-white',
                    isMarkingAll && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
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

          {/* Filter Tabs */}
          <div
            className={cn(
              'flex items-center gap-1.5 overflow-x-auto border-b px-3 py-2 no-scrollbar',
              isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E293B] bg-[#161F2F]/40',
            )}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'trip', label: 'Trips' },
              { id: 'payment', label: 'Billing' },
              { id: 'system', label: 'System' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all duration-150',
                  activeTab === tab.id
                    ? isLight
                      ? 'bg-[#E63946] text-white shadow-xs'
                      : 'bg-primary text-white'
                    : isLight
                      ? 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white',
                )}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={cn(
                      'ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-[#E63946]',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List Area */}
          <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-2.5 w-1/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl mb-3',
                    isLight ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-slate-500',
                  )}
                >
                  <BellOff className="h-6 w-6" />
                </div>
                <p
                  className={cn(
                    'text-sm font-bold',
                    isLight ? 'text-slate-800' : 'text-slate-200',
                  )}
                >
                  {activeTab === 'unread' ? "You're all caught up!" : 'No notifications'}
                </p>
                <p
                  className={cn(
                    'text-xs mt-1 max-w-[220px]',
                    isLight ? 'text-slate-500' : 'text-slate-400',
                  )}
                >
                  {activeTab === 'unread'
                    ? 'No pending unread alerts at this time.'
                    : 'Emergency updates, dispatch telemetry, and invoices will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const visuals = getNotificationVisuals(item.type, isLight);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={cn(
                      'group relative flex cursor-pointer items-start gap-3 p-3.5 transition-colors',
                      isLight
                        ? cn(
                            'hover:bg-slate-50',
                            !item.isRead ? 'bg-red-50/25' : 'bg-white',
                          )
                        : cn(
                            'hover:bg-[#1A2234]',
                            !item.isRead ? 'bg-[#151D2C]' : 'bg-transparent',
                          ),
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs',
                        visuals.bg,
                      )}
                    >
                      {visuals.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'truncate text-xs font-bold',
                            isLight ? 'text-slate-900' : 'text-white',
                            !item.isRead && 'font-black',
                          )}
                        >
                          {item.title}
                        </p>
                        {!item.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#E63946]" />
                        )}
                      </div>

                      <p
                        className={cn(
                          'mt-0.5 line-clamp-2 text-xs leading-relaxed',
                          isLight ? 'text-slate-600' : 'text-slate-300',
                        )}
                      >
                        {item.message}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-semibold',
                            isLight ? 'text-slate-400' : 'text-slate-500',
                          )}
                        >
                          {formatRelativeTime(item.createdAt)}
                        </span>
                        {item.type && (
                          <span
                            className={cn(
                              'rounded-md border px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase',
                              visuals.badgeColor,
                            )}
                          >
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons (shown on hover) */}
                    <div className="absolute right-2 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!item.isRead && (
                        <button
                          type="button"
                          title="Mark as read"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(item.id);
                          }}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors cursor-pointer',
                            isLight
                              ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800',
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Delete notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item.id);
                        }}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors cursor-pointer',
                          isLight
                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-slate-400 hover:text-red-400 hover:bg-slate-800',
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            onClick={handleNavigateToAll}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-1.5 border-t p-3 text-center text-xs font-bold transition-colors',
              isLight
                ? 'border-slate-100 bg-slate-50/60 text-[#E63946] hover:bg-red-50/50 hover:text-red-700'
                : 'text-primary border-[#1E293B] bg-[#111827] hover:text-blue-300',
            )}
          >
            <span>View all notifications</span>
            <ArrowRight className="h-3.5 w-3.5" />
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
