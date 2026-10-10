import { INotificationItem } from '@/services/notification/notification.service';

/**
 * Resolves a notification's smart destination URL based on user role and notification payload,
 * correcting raw backend paths (like `/trips/UUID` or `/wallet`) into active frontend routes.
 */
export function resolveNotificationUrl(
  item: INotificationItem,
  role?: string
): { url: string; label: string } {
  const type = (item.type || '').toUpperCase();
  const title = (item.title || '').toLowerCase();
  const rawLink = item.link || '';
  const normalizedRole = (role || '').toLowerCase();

  // 1. Explicit dashboard routes
  if (rawLink.startsWith('/dashboard/')) {
    return { url: rawLink, label: 'Open Dashboard' };
  }

  // 2. Trip / Emergency Dispatch / Ambulance
  if (
    rawLink.startsWith('/trips/') ||
    type === 'TRIP' ||
    type === 'EMERGENCY' ||
    title.includes('emergency') ||
    title.includes('ambulance') ||
    title.includes('trip') ||
    title.includes('dispatch')
  ) {
    const tripId = item.metadata?.tripId || rawLink.replace('/trips/', '') || '';

    if (normalizedRole === 'driver') {
      return { url: '/dashboard/driver', label: 'Open Duty Cockpit' };
    }
    if (normalizedRole === 'super-admin' || normalizedRole === 'admin') {
      return { url: '/dashboard/super-admin/trips', label: 'View Trip Management' };
    }
    // Patient
    return {
      url: tripId ? `/dashboard/patient/active-trip?tripId=${tripId}` : '/dashboard/patient/trips',
      label: tripId ? 'Track Active Trip' : 'View Trip History',
    };
  }

  // 3. Wallet / Payout / Earnings / Credit
  if (
    rawLink === '/wallet' ||
    rawLink.startsWith('/wallet') ||
    type === 'WALLET' ||
    title.includes('wallet') ||
    title.includes('credit') ||
    title.includes('payout') ||
    title.includes('earning')
  ) {
    if (normalizedRole === 'driver') {
      return { url: '/dashboard/driver/wallet', label: 'Open Driver Wallet' };
    }
    if (normalizedRole === 'super-admin' || normalizedRole === 'admin') {
      return { url: '/dashboard/super-admin/payouts', label: 'Manage Driver Payouts' };
    }
    return { url: '/dashboard/patient', label: 'View Account' };
  }

  // 4. Invoices / Payments
  if (
    rawLink.startsWith('/invoices/') ||
    type === 'PAYMENT' ||
    title.includes('invoice') ||
    title.includes('payment')
  ) {
    if (normalizedRole === 'super-admin' || normalizedRole === 'admin') {
      return { url: '/dashboard/super-admin/revenue', label: 'View Revenue & Invoices' };
    }
    if (normalizedRole === 'driver') {
      return { url: '/dashboard/driver/wallet', label: 'View Earning Invoice' };
    }
    return { url: '/dashboard/patient/trips', label: 'View Trip Invoices' };
  }

  // 5. KYC / Verification
  if (
    title.includes('kyc') ||
    title.includes('verification') ||
    title.includes('license') ||
    title.includes('approved')
  ) {
    if (normalizedRole === 'super-admin' || normalizedRole === 'admin') {
      return { url: '/dashboard/super-admin', label: 'Review Driver KYC' };
    }
    return { url: '/dashboard/driver/kyc', label: 'View Verification Status' };
  }

  // 6. Fleet / Vehicle
  if (title.includes('vehicle') || title.includes('ambulance model')) {
    if (normalizedRole === 'super-admin' || normalizedRole === 'admin') {
      return { url: '/dashboard/super-admin/fleet', label: 'View Ambulance Fleet' };
    }
    return { url: '/dashboard/driver/ambulance-profile', label: 'View Vehicle Profile' };
  }

  // Default fallbacks based on role
  if (normalizedRole === 'driver') {
    return { url: '/dashboard/driver/notifications', label: 'View Notifications' };
  }
  if (normalizedRole === 'super-admin') {
    return { url: '/dashboard/super-admin/announcements', label: 'View Announcements' };
  }
  return { url: '/dashboard/patient/notifications', label: 'View Notifications' };
}
