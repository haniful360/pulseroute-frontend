import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 shadow-sm shadow-destructive/25',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/25',
        outline:
          'border border-slate-200 bg-background text-slate-700 shadow-xs hover:bg-slate-100 hover:text-primary hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 shadow-xs',
        ghost:
          'hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-300',
        link: 'text-primary underline-offset-4 hover:underline',
        emergency:
          'bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-100/90 font-bold shadow-xs',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3 text-sm',
        xs: "h-7 gap-1 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8.5 gap-1.5 px-3.5 text-xs has-[>svg]:px-2.5 font-semibold',
        lg: 'h-11 px-6 text-sm sm:text-base has-[>svg]:px-4 font-semibold',
        xl: 'h-12 px-8 text-base has-[>svg]:px-5 font-bold',
        icon: 'size-9 p-0',
        'icon-xs': "size-7 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-8 p-0',
        'icon-lg': 'size-10 p-0',
      },
      rounded: {
        default: 'rounded-lg',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  rounded = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-rounded={rounded}
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
