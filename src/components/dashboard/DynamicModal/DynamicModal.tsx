'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from 'radix-ui';

import React from 'react';

/**
 * @component DynamicModal
 * @description Fixed accessibility error where DialogTitle was missing when no title was provided.
 */

interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  className = '',
  variant = 'light',
}) => {
  const isLight = variant === 'light';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-137.5 gap-0 rounded-2xl p-5 ${
          isLight
            ? 'border-gray-200 bg-white text-slate-900 shadow-2xl'
            : 'border-white/10 bg-[#0B1120] text-white shadow-xl'
        } ${className}`}
      >
        {!title && (
          <VisuallyHidden.Root>
            <DialogTitle>Modal Dialog</DialogTitle>
          </VisuallyHidden.Root>
        )}

        {/* Visible Header Section */}
        {(title || description || subtitle) && (
          <div className="mb-4 flex flex-col space-y-1">
            {title && (
              <DialogTitle
                className={`text-xl font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {title}
              </DialogTitle>
            )}

            {(description || subtitle) && (
              <DialogDescription
                className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-muted'}`}
              >
                {description || subtitle}
              </DialogDescription>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="w-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicModal;
