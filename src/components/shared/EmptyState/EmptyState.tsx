import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'light',
}: EmptyStateProps) {
  const isLight = variant === 'light';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed p-8 sm:p-12 text-center transition-all',
        isLight
          ? 'border-slate-200 bg-slate-50/50 text-slate-900'
          : 'border-slate-800 bg-[#0b132b]/50 text-white',
        className
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 hover:scale-105',
          isLight
            ? 'bg-white text-slate-400 border border-slate-100'
            : 'bg-white/5 text-slate-400 border border-white/10'
        )}
      >
        <Icon className="h-7 w-7 text-[#e63946]" />
      </div>

      <h3
        className={cn(
          'mt-4 text-base font-bold sm:text-lg',
          isLight ? 'text-slate-900' : 'text-white'
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'mt-1.5 max-w-sm text-xs sm:text-sm leading-relaxed',
            isLight ? 'text-slate-500' : 'text-slate-400'
          )}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-5">
          <DynamicActionButton
            variant={isLight ? 'outline' : 'danger'}
            label={actionLabel}
            onClick={onAction}
            className="text-xs"
          />
        </div>
      )}
    </div>
  );
}
