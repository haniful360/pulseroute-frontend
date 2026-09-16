'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Loader2, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface DynamicButtonProps {
  type?: 'submit' | 'button';
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'danger' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon | null;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

const DynamicActionButton = ({
  type = 'button',
  label,
  href,
  onClick,
  className,
  variant = 'default',
  disabled = false,
  isLoading = false,
  icon: Icon = ArrowUpRight,
  showIcon = false,
  iconPosition = 'right',
}: DynamicButtonProps) => {
  const variantStyles = {
    default: 'bg-primary text-white border-primary hover:bg-primary/90',
    outline: 'bg-transparent border-[#334155] text-[#9CA3AF] hover:bg-primary/5',
    danger: 'bg-red-500 text-white border-red-600 hover:bg-red-600 ',
    secondary: 'bg-white/80 border-primary hover:border-primary/90 hover:bg-white/90 text-primary',
  };

  const combinedClasses = cn(
    'group relative h-11 text-xs sm:h-13 w-fit cursor-pointer sm:text-base transition-all duration-300 border px-8 active:scale-95 flex items-center justify-center gap-2 font-semibold overflow-hidden',
    variantStyles[variant],
    className,
  );

  const renderIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

    if (showIcon && Icon) {
      return (
        <Icon
          size={18}
          strokeWidth={2.5}
          className={cn('transition-transform duration-300', {
            'group-hover:translate-x-1 group-hover:-translate-y-1': iconPosition === 'right',
          })}
        />
      );
    }
    return null;
  };

  const buttonContent = (
    <>
      {iconPosition === 'left' && renderIcon()}

      <span
        className={cn('relative z-10 transition-transform duration-300', {
          'group-hover:-translate-x-0.5': iconPosition === 'right',
        })}
      >
        {label}
      </span>

      {iconPosition === 'right' && renderIcon()}
    </>
  );

  if (href && !disabled) {
    return (
      <Button asChild className={combinedClasses}>
        <Link href={href} className="flex items-center">
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled || isLoading}
    >
      {buttonContent}
    </Button>
  );
};

export default DynamicActionButton;
