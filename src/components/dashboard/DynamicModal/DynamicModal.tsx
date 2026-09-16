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
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-137.5 gap-0 p-4 ${className} bg-[#0B1120]`}>
        {!title && (
          <VisuallyHidden.Root>
            <DialogTitle>Modal Dialog</DialogTitle>
          </VisuallyHidden.Root>
        )}

        {/* Visible Header Section */}
        {(title || description) && (
          <div className="mb-4 flex flex-col space-y-1">
            {title && (
              <DialogTitle className="text-xl font-semibold tracking-tight text-white">
                {title}
              </DialogTitle>
            )}

            {description && (
              <DialogDescription className="text-muted text-sm leading-relaxed">
                {description}
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
