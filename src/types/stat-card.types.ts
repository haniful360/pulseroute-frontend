import { LucideIcon } from 'lucide-react';

export interface IStatCard {
  id?: number;
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: LucideIcon;
  borderActive?: string;
  iconBg: string;
}
