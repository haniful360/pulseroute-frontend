import {
  Activity,
  Ambulance,
  AppWindow,
  Award,
  Bookmark,
  BookOpen,
  CreditCard,
  HeartPulse,
  LayoutGrid,
  MessagesSquare,
  PackageSearch,
  PlaySquare,
  Settings,
  ShieldCheck,
  Target,
  Users,
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

// Patient Dashboard Routes (PulseRoute Figma 2:8109)
export const patientRoutes = [
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
