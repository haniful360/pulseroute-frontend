import { LucideIcon } from 'lucide-react';

/**
 * @component DynamicBadge
 * @description A flexible badge component that supports custom colors, sizes, and icons.
 * It automatically applies a subtle background tint based on the color prop.
 * * @example
 * // Basic usage
 * <DynamicBadge text="Active" color="#10b981" />
 *
 * * // With an Icon (Pass the Lucide icon reference)
 *
 * import { ShieldCheck } from 'lucide-react';
 * <DynamicBadge text="Verified" color="#3b82f6" icon={ShieldCheck} size="sm" />
 */

interface IBadgeProps {
  text: string;
  color?: string;
  size?: 'xs' | 'sm' | 'base';
  icon?: LucideIcon;
  className?: string;
}

const DynamicBadge = ({
  text,
  color = '#00B8A9',
  size = 'xs',
  icon: Icon,
  className = '',
}: IBadgeProps) => {
  // Mapping sizes to Tailwind classes
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    base: 'px-3 py-1.5 text-base gap-2',
  };

  // Icon size mapping
  const iconSizes = {
    xs: 11,
    sm: 13,
    base: 15,
  };

  return (
    <div
      className={`inline-flex w-fit items-center justify-center rounded font-semibold tracking-wider text-nowrap uppercase transition-all ${sizeClasses[size]} ${className}`}
      style={{
        // Adding '1A' to the hex color for 10% opacity background
        backgroundColor: `${color}1A`,
        color: color,
      }}
    >
      {/* Only render icon if it's provided */}
      {Icon && <Icon size={iconSizes[size]} strokeWidth={2.5} />}

      <span>{text}</span>
    </div>
  );
};

export default DynamicBadge;
