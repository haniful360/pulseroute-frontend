import React from 'react';
import { cn } from '@/lib/utils';

// Gradient colors Map
const colorMap = {
  blue: 'rgba(0, 97, 255, 0.8)',
  green: 'rgba(34, 197, 94, 0.8)',
  purple: 'rgba(168, 85, 247, 0.8)',
  yellow: 'rgba(234, 179, 8, 0.8)',
};

type GradientColor = keyof typeof colorMap;

interface GradientWrapperProps {
  children: React.ReactNode;
  color?: GradientColor;
  className?: string;
  innerClassName?: string;
}

const GradientWrapper = ({
  children,
  color = 'purple',
  className = '',
  innerClassName = '',
}: GradientWrapperProps) => {
  return (
    <section
      className={cn('relative h-fit w-full overflow-hidden rounded-md p-[1.5px]', className)}
      style={{
        background: `linear-gradient(180deg, ${colorMap[color]}, transparent 90%)`,
      }}
    >
      <div className={cn('flex h-full w-full flex-col rounded-md bg-[#0F172A]', innerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default GradientWrapper;
