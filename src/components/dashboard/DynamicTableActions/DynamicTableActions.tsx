'use client';

import {
  Ban,
  Check,
  Download,
  Eye,
  MessageCircle,
  MousePointer2,
  Pencil,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';

export type ActionType =
  | 'edit'
  | 'delete'
  | 'view'
  | 'save'
  | 'close'
  | 'suspend'
  | 'message'
  | 'dbl-Click'
  | 'download'
  | 'share';

interface ActionItem {
  type: ActionType;
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  customColor?: string;
}

interface DynamicTableActionsProps {
  actions: ActionItem[];
}

const DynamicTableActions = ({ actions }: DynamicTableActionsProps) => {
  const iconMap = {
    edit: { icon: Pencil, defaultLabel: 'Edit', color: '#3B82F6' },
    delete: { icon: Trash2, defaultLabel: 'Delete', color: '#EF4444' },
    view: { icon: Eye, defaultLabel: 'View', color: '#94A3B8' },
    save: { icon: Check, defaultLabel: 'Save', color: '#10B981' },
    close: { icon: X, defaultLabel: 'Cancel', color: '#6B7280' },
    suspend: { icon: Ban, defaultLabel: 'Suspend', color: '#EF4444' },
    message: { icon: MessageCircle, defaultLabel: 'Message', color: '#10B981' },
    'dbl-Click': { icon: MousePointer2, defaultLabel: 'Dbl-Click', color: '#6366F1' },
    download: { icon: Download, defaultLabel: 'Download', color: '#94A3B8' },
    share: { icon: Share2, defaultLabel: 'Share', color: '#2563EB' },
  };

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const config = iconMap[action.type];

        if (!config) return null;

        const Icon = config.icon;
        const targetColor = action.customColor || config.color;

        const dynamicStyle = {
          color: targetColor,
          backgroundColor: `${targetColor}1A`,
          borderColor: `${targetColor}33`,
        };

        const commonClass = `group flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer border text-xs font-medium transition-all hover:brightness-110 active:scale-95 ${action.className || ''}`;

        const content = (
          <>
            <Icon size={14} className="transition-transform group-hover:scale-110" />
            <span>{action.label || config.defaultLabel}</span>
          </>
        );

        if (action.href) {
          return (
            <Link key={index} href={action.href} className={commonClass} style={dynamicStyle}>
              {content}
            </Link>
          );
        }

        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick?.();
            }}
            className={commonClass}
            style={dynamicStyle}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default DynamicTableActions;
