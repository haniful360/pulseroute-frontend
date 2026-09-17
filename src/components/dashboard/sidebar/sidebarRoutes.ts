import {
  Activity,
  Ambulance,
  AppWindow,
  Award,
  BarChart3,
  Bookmark,
  BookOpen,
  Building2,
  CreditCard,
  DollarSign,
  HeartPulse,
  History,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  MessagesSquare,
  Navigation,
  PackageSearch,
  PlaySquare,
  Radio,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';

export type roleTypes =
  | 'patient'
  | 'driver'
  | 'admin'
  | 'super-admin'
  | 'enterprise'
  | 'sarah'
  | 'sarah-team-member'
  | 'student'
  | 'noah'
  | 'marcus';

export interface SidebarRouteItem {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  badge?: string;
  badgeVariant?: 'red' | 'green' | 'blue' | 'gray';
  section?: string;
  items?: { title: string; url: string }[];
}

// Patient Dashboard Routes (PulseRoute Figma 2:8109)
export const patientRoutes: SidebarRouteItem[] = [
  {
    title: 'Book Ambulance',
    url: '/dashboard/patient/book-ambulance',
    icon: Ambulance,
  },
  {
    title: 'Active Trip',
    url: '/dashboard/patient/active-trip',
    icon: Activity,
  },
  {
    title: 'Trip History',
    url: '/dashboard/patient/trip-history',
    icon: HeartPulse,
  },
  {
    title: 'Payment Methods',
    url: '/dashboard/patient/payment-methods',
    icon: CreditCard,
  },
  {
    title: 'Medical Profile',
    url: '/dashboard/patient/medical-profile',
    icon: ShieldCheck,
  },
  {
    title: 'Settings',
    url: '/dashboard/patient/settings',
    icon: Settings,
  },
];

// Driver Dashboard Routes (PulseRoute Figma 2:8467)
export const driverRoutes: SidebarRouteItem[] = [
  // OPERATIONS
  {
    title: 'Live Duty Radar',
    url: '/dashboard/driver',
    icon: Radio,
    section: 'OPERATIONS',
  },
  {
    title: 'Active Dispatch',
    url: '/dashboard/driver/active-dispatch',
    icon: Navigation,
    badge: '1',
    badgeVariant: 'red',
    section: 'OPERATIONS',
  },
  {
    title: 'Stripe Wallet',
    url: '/dashboard/driver/wallet',
    icon: Wallet,
    section: 'OPERATIONS',
  },
  {
    title: 'Shift History',
    url: '/dashboard/driver/shift-history',
    icon: History,
    section: 'OPERATIONS',
  },
  // FLEET & LEGAL
  {
    title: 'Ambulance Profile',
    url: '/dashboard/driver/ambulance-profile',
    icon: Truck,
    section: 'FLEET & LEGAL',
  },
  {
    title: 'KYC Verification',
    url: '/dashboard/driver/kyc',
    icon: ShieldCheck,
    badge: '✓',
    badgeVariant: 'green',
    section: 'FLEET & LEGAL',
  },
  {
    title: 'Settings',
    url: '/dashboard/driver/settings',
    icon: Settings,
    section: 'FLEET & LEGAL',
  },
  // COMING SOON
  {
    title: 'AI Traffic Opt.',
    url: '/dashboard/driver/traffic-opt',
    icon: Sparkles,
    section: 'COMING SOON',
  },
  {
    title: 'Ward Status',
    url: '/dashboard/driver/ward-status',
    icon: Building2,
    section: 'COMING SOON',
  },
];

// Super Admin Dashboard Routes (PulseRoute Figma 3:2)
export const superAdminRoutes: SidebarRouteItem[] = [
  // MAIN
  {
    title: 'Executive Overview',
    url: '/dashboard/super-admin/overview',
    icon: LayoutDashboard,
    section: 'MAIN',
  },
  {
    title: 'Live Fleet Radar',
    url: '/dashboard/super-admin/radar',
    icon: Radio,
    section: 'MAIN',
  },
  {
    title: 'Trip Management',
    url: '/dashboard/super-admin/trips',
    icon: Route,
    section: 'MAIN',
  },
  // MANAGEMENT
  {
    title: 'Driver (KYC)',
    url: '/dashboard/super-admin',
    icon: UserCheck,
    section: 'MANAGEMENT',
  },
  {
    title: 'Ambulance Fleet',
    url: '/dashboard/super-admin/fleet',
    icon: Ambulance,
    section: 'MANAGEMENT',
  },
  {
    title: 'User Management',
    url: '/dashboard/super-admin/users',
    icon: Users,
    section: 'MANAGEMENT',
  },
  // FINANCIALS
  {
    title: 'Pricing & Commission',
    url: '/dashboard/super-admin/pricing',
    icon: DollarSign,
    section: 'FINANCIALS',
  },
  {
    title: 'Revenue Ops',
    url: '/dashboard/super-admin/revenue',
    icon: BarChart3,
    section: 'FINANCIALS',
  },
  // FOOTER ITEMS
  {
    title: 'Announcements',
    url: '/dashboard/super-admin/announcements',
    icon: Megaphone,
    section: 'FOOTER',
  },
  {
    title: 'Settings',
    url: '/dashboard/super-admin/settings',
    icon: Settings,
    section: 'FOOTER',
  },
];

// Super Admin Dashboard All Routes List
export const AdminRoutes = [
  {
    title: 'Overview',
    url: '/dashboard/admin/overview',
    icon: LayoutGrid,
  },
  {
    title: 'User Management',
    url: '/dashboard/admin/user-management',
    icon: BookOpen,
  },
  // {
  //   title: 'System Configs',
  //   url: '/dashboard/admin/system-configs',
  //   icon: Presentation,
  // },
  {
    title: 'CMS / Content',
    url: '/dashboard/admin/cms-content',
    icon: Target,
  },
  {
    title: 'Public Content',
    url: '/dashboard/admin/public-content',
    icon: PackageSearch,
    items: [
      {
        title: 'Service Management',
        url: '/dashboard/admin/public-content/service-management',
      },
      {
        title: 'Product Management',
        url: '/dashboard/admin/public-content/product-management',
      },
      {
        title: 'Insights',
        url: '/dashboard/admin/public-content/insights',
      },
    ],
  },
  {
    title: 'Billing',
    url: '/dashboard/admin/billing',
    icon: PlaySquare,
  },
  {
    title: 'Support Tickets',
    url: '/dashboard/admin/support-tickets',
    icon: Award,
  },
  {
    title: 'Settings',
    url: '/dashboard/admin/settings',
    icon: Settings,
  },
];

// Enterprise Dashboard All Routes List
export const enterpriseRoutes = [
  { title: 'Overview', url: '/dashboard/enterprise/overview', icon: LayoutGrid },
  { title: 'Team Management', url: '/dashboard/enterprise/team-management', icon: Users },
  { title: 'Team Chat', url: '/dashboard/enterprise/chat', icon: MessagesSquare },
  { title: 'Usage & Engagement', url: '/dashboard/enterprise/usage-engagement', icon: PlaySquare },
  { title: 'Content Library', url: '/dashboard/enterprise/content-library', icon: AppWindow },
  { title: 'Bookmarks', url: '/dashboard/bookmarks', icon: Bookmark },
  { title: 'Account Settings', url: '/dashboard/enterprise/account-settings', icon: Settings },
];

export const sarahRoutes = enterpriseRoutes;

export const sarahTeamMemberRoutes = [
  { title: 'Overview', url: '/dashboard/sarah-team-member/overview', icon: LayoutGrid },
  { title: 'Usage Analytics', url: '/dashboard/sarah-team-member/usage-analytics', icon: BookOpen },
  { title: 'Value Vault', url: '/dashboard/sarah-team-member/value-vault', icon: PlaySquare },
  { title: 'Bookmarks', url: '/dashboard/bookmarks', icon: Bookmark },
  { title: 'Team Chat', url: '/dashboard/sarah-team-member/team-chat', icon: MessagesSquare },
  { title: 'Account Settings', url: '/dashboard/sarah-team-member/settings', icon: Settings },
];

export const studentRoutes = (onATeam?: boolean) => [
  { title: 'Dashboard', url: '/dashboard/student/overview', icon: LayoutGrid },
  { title: 'Usage Analytics', url: '/dashboard/student/usage-analytics', icon: BookOpen },
  { title: 'Value Vault', url: '/dashboard/student/value-vault', icon: PlaySquare },
  { title: 'Bookmarks', url: '/dashboard/bookmarks', icon: Bookmark },
  ...(onATeam
    ? [{ title: 'Team Message', url: '/dashboard/student/team-chat', icon: MessagesSquare }]
    : []),
  { title: 'Settings', url: '/dashboard/student/settings', icon: Settings },
];

export const noahRoutes = studentRoutes;

export const marcusRoutes = [
  { title: 'Overview', url: '/dashboard/marcus/overview', icon: LayoutGrid },
  { title: 'Team Management', url: '/dashboard/marcus/team-management', icon: Users },
  { title: 'Usage & Engagement', url: '/dashboard/marcus/usage-engagement', icon: PlaySquare },
  { title: 'Content Library', url: '/dashboard/marcus/content-library', icon: AppWindow },
  { title: 'Bookmarks', url: '/dashboard/bookmarks', icon: Bookmark },
  { title: 'Account Settings', url: '/dashboard/marcus/account-settings', icon: Settings },
];
