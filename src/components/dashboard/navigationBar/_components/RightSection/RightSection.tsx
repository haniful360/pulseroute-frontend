'use client';

import { roleTypes } from '@/components/dashboard/sidebar/sidebarRoutes';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/context/ModalContext';
import {
  ArrowRight,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

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

  const isPatient = role === 'patient';
  const isDriver = role === 'driver';
  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin';
  const isLight = isPatient || isDriver || isSuperAdmin || isAdmin;

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
            {isSuperAdmin && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#E63946] px-1 text-[10px] font-bold text-white shadow-xs">
                12
              </span>
            )}
            {(isPatient || isDriver) && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#E63946] ring-2 ring-white" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 w-100 overflow-hidden rounded-md border border-[#1E293B] bg-[#111827] p-0 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <span className="bg-primary/20 text-primary rounded-full px-3 py-1.5 text-[10px] font-semibold">
                3
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray cursor-pointer text-xs hover:text-white">
                Mark all read
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray cursor-pointer hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 p-4">
            <span className="bg-primary cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium text-white">
              All
            </span>
            <span className="text-gray cursor-pointer px-4 py-1.5 text-xs hover:text-white">
              Unread
            </span>
            <span className="text-gray cursor-pointer px-4 py-1.5 text-xs hover:text-white">
              Mentions
            </span>
          </div>

          {/* List */}
          <div className="max-h-100 overflow-y-auto">
            {notificationsData.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b border-[#1E293B] p-4 transition-colors hover:bg-[#1A2234]"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${item.color}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-gray mt-0.5 text-xs">{item.desc}</p>
                  <p className="text-gray mt-1 text-[10px]">{item.time}</p>
                </div>
                {item.unread && <div className="bg-primary mt-2 h-2 w-2 rounded-full" />}
                {item.badge && (
                  <span className="bg-primary rounded-full px-1.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="text-primary flex cursor-pointer items-center justify-center gap-2 border-t border-[#1E293B] p-3 text-center text-xs hover:text-blue-300">
            View all notifications <ArrowRight className="h-4 w-4" />
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
