'use client';

import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import { FolderOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no items to display at the moment.',
  icon: Icon = FolderOpen,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) => {
  return (
    <div className="p-6">
      <div className="flex min-h-87.5 w-full flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition-all sm:p-10">
        {/* Icon Container */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-[#0F172A] text-slate-500 sm:h-16 sm:w-16">
          <Icon className="h-7 w-7 text-slate-400 sm:h-8 sm:w-8" />
        </div>

        {/* Text Context */}
        <h3 className="mb-1 text-base font-semibold text-white sm:text-lg">{title}</h3>
        <p className="mb-6 max-w-xs text-xs text-[#94A3B8] sm:max-w-sm sm:text-sm">{description}</p>

        {/* Conditional Action Button */}
        {actionLabel && (actionHref || onActionClick) && (
          <DynamicActionButton
            label={actionLabel}
            href={actionHref}
            onClick={onActionClick}
            className="h-11!"
            iconPosition="left"
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
