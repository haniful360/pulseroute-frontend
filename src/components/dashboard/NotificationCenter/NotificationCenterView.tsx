'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { useNotifications } from '@/context/NotificationContext';
import { INotificationItem } from '@/services/notification/notification.service';
import NotificationsSkeleton from '@/components/dashboard/skeletons/shared/NotificationsSkeleton';
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
  ExternalLink,
  Filter,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

function formatRelativeTime(dateString: string) {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (isNaN(diff) || diff < 0) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

function getVisuals(type: string) {
  const upperType = (type || '').toUpperCase();
  switch (upperType) {
    case 'TRIP':
      return {
        icon: Ambulance,
        bg: 'bg-red-50 text-[#e63946] border-red-200',
        badgeColor: '#e63946',
      };
    case 'PAYMENT':
      return {
        icon: CreditCard,
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        badgeColor: '#10b981',
      };
    case 'WALLET':
      return {
        icon: Wallet,
        bg: 'bg-amber-50 text-amber-600 border-amber-200',
        badgeColor: '#f59e0b',
      };
    case 'ACCOUNT':
      return {
        icon: ShieldCheck,
        bg: 'bg-blue-50 text-blue-600 border-blue-200',
        badgeColor: '#3b82f6',
      };
    case 'EMERGENCY':
      return {
        icon: AlertTriangle,
        bg: 'bg-red-100 text-red-700 border-red-300',
        badgeColor: '#dc2626',
      };
    case 'SYSTEM':
    default:
      return {
        icon: Radio,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        badgeColor: '#64748b',
      };
  }
}

export default function NotificationCenterView({
  dashboardType = 'patient',
}: {
  dashboardType?: 'patient' | 'driver';
}) {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'TRIP' | 'PAYMENT' | 'SYSTEM'>('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  if (isLoading && notifications.length === 0) {
    return <NotificationsSkeleton />;
  }

  // Filtered list
  const filtered = notifications.filter((item) => {
    // Status / Type filter
    if (selectedTab === 'unread' && item.isRead) return false;
    if (selectedTab === 'TRIP' && (item.type || '').toUpperCase() !== 'TRIP') return false;
    if (
      selectedTab === 'PAYMENT' &&
      !['PAYMENT', 'WALLET'].includes((item.type || '').toUpperCase())
    )
      return false;
    if (
      selectedTab === 'SYSTEM' &&
      !['SYSTEM', 'ACCOUNT'].includes((item.type || '').toUpperCase())
    )
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchMsg = (item.message || '').toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    return true;
  });

  const tripAlertsCount = notifications.filter(
    (n) => (n.type || '').toUpperCase() === 'TRIP',
  ).length;

  const paymentAlertsCount = notifications.filter((n) =>
    ['PAYMENT', 'WALLET'].includes((n.type || '').toUpperCase()),
  ).length;

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    await markAllAsRead();
    setIsMarkingAll(false);
  };

  const handleItemClick = async (item: INotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title={
            dashboardType === 'driver'
              ? 'Paramedic Dispatch Notifications & Alerts'
              : 'Emergency Response Notifications & History'
          }
          description="Real-time telemetry updates, mission dispatches, hospital transfers, and settlement receipts."
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <DynamicActionButton
            variant="outline"
            icon={RefreshCw}
            iconPosition="left"
            onClick={() => {
              fetchNotifications();
              toast.info('Notifications refreshed.');
            }}
            label="Refresh"
            disabled={isRefreshing}
          />
          {unreadCount > 0 && (
            <DynamicActionButton
              variant="danger"
              icon={CheckCheck}
              iconPosition="left"
              onClick={handleMarkAllRead}
              label="Mark All as Read"
              disabled={isMarkingAll}
            />
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TOTAL NOTIFICATIONS
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{notifications.length}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Platform activity log</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            UNREAD ALERTS
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p
              className={cn(
                'text-3xl font-black',
                unreadCount > 0 ? 'text-[#E63946]' : 'text-slate-900',
              )}
            >
              {unreadCount}
            </p>
            {unreadCount > 0 && (
              <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-500" />
            )}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">Require your attention</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TRIP DISPATCHES
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{tripAlertsCount}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">Ambulance missions</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            BILLING & WALLET
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{paymentAlertsCount}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Receipts & payouts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <InputField
            placeholder="Search by notification title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'TRIP', label: 'Trips', count: tripAlertsCount },
            { id: 'PAYMENT', label: 'Billing', count: paymentAlertsCount },
            { id: 'SYSTEM', label: 'System' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id as any)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-150',
                selectedTab === tab.id
                  ? 'bg-[#e63946] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900',
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                    selectedTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-700 shadow-xs',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 mb-4 shadow-xs">
              <BellOff className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No notifications found</h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {searchQuery || selectedTab !== 'all'
                ? 'No notifications match your active search or filter criteria. Try resetting your filter.'
                : 'All clear! You currently have no notifications logged to your account.'}
            </p>
            {(searchQuery || selectedTab !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTab('all');
                }}
                className="mt-4 text-xs font-bold text-[#e63946] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filtered.map((item) => {
            const visuals = getVisuals(item.type);
            const Icon = visuals.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  'group flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center sm:justify-between',
                  !item.isRead ? 'bg-red-50/20' : 'hover:bg-slate-50/60',
                )}
              >
                {/* Left: Icon & Content */}
                <div
                  className="flex flex-1 cursor-pointer items-start gap-4"
                  onClick={() => handleItemClick(item)}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-xs',
                      visuals.bg,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={cn(
                          'text-sm font-bold text-slate-900',
                          !item.isRead && 'font-black',
                        )}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <DynamicBadge text="New" color="#e63946" size="xs" />
                      )}
                      <DynamicBadge
                        text={item.type || 'SYSTEM'}
                        color={visuals.badgeColor}
                        size="xs"
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
                      <span>{formatRelativeTime(item.createdAt)}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  {item.link && (
                    <Link
                      href={item.link}
                      onClick={() => !item.isRead && markAsRead(item.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#e63946] hover:text-[#e63946] shadow-2xs"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {!item.isRead && (
                    <button
                      type="button"
                      title="Mark as read"
                      onClick={() => markAsRead(item.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    title="Delete notification"
                    onClick={() => deleteNotification(item.id)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
