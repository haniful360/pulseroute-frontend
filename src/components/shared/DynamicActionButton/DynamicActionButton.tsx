'use client';

import React from 'react';
import Link from 'next/link';
import { Button, type buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Loader2, type LucideIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';

export interface DynamicActionButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  label?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  rounded?: VariantProps<typeof buttonVariants>['rounded'];
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon | React.ReactNode | null;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  external?: boolean;
}

export const DynamicActionButton = React.forwardRef<HTMLButtonElement, DynamicActionButtonProps>(
  (
    {
      type = 'button',
      label,
      children,
      href,
      onClick,
      className,
      variant = 'default',
      size = 'default',
      rounded = 'default',
      disabled = false,
      isLoading = false,
      icon: Icon,
      showIcon = false,
      iconPosition = 'right',
      fullWidth = false,
      external,
      ...props
    },
    ref,
  ) => {
    // If showIcon is true but no custom icon is passed, default to ArrowUpRight
    const ResolvedIcon = Icon ?? (showIcon ? ArrowUpRight : null);

    const renderIcon = () => {
      if (isLoading) {
        return <Loader2 className="h-4 w-4 shrink-0 animate-spin" />;
      }

      if (React.isValidElement(Icon)) {
        return Icon;
      }

      if (showIcon && ResolvedIcon && typeof ResolvedIcon === 'function') {
        const IconComponent = ResolvedIcon as LucideIcon;
        return (
          <IconComponent
            size={16}
            strokeWidth={2.5}
            className={cn('shrink-0 transition-transform duration-300', {
              'group-hover:translate-x-0.5 group-hover:-translate-y-0.5':
                iconPosition === 'right' && ResolvedIcon === ArrowUpRight,
              'group-hover:translate-x-0.5':
                iconPosition === 'right' && ResolvedIcon !== ArrowUpRight,
              'group-hover:-translate-x-0.5': iconPosition === 'left',
            })}
          />
        );
      }
      return null;
    };

    const content = (
      <>
        {iconPosition === 'left' && renderIcon()}
        {label && <span>{label}</span>}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );

    const combinedClasses = cn(
      'group transition-all duration-200',
      fullWidth && 'w-full',
      className,
    );

    if (href && !disabled) {
      const isExternalOrSpecial =
        external ||
        href.startsWith('http') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#');

      return (
        <Button asChild variant={variant} size={size} rounded={rounded} className={combinedClasses}>
          {isExternalOrSpecial ? (
            <a
              href={href}
              onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
              target={external || href.startsWith('http') ? '_blank' : undefined}
              rel={external || href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {content}
            </a>
          ) : (
            <Link href={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
              {content}
            </Link>
          )}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        type={type}
        onClick={onClick}
        variant={variant}
        size={size}
        rounded={rounded}
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </Button>
    );
  },
);

DynamicActionButton.displayName = 'DynamicActionButton';

export default DynamicActionButton;
