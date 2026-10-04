'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/services/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useLogout() {
  const router = useRouter();
  const { user } = useAuth();

  return async () => {
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push(isSuperAdmin ? '/super-admin/login' : '/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push(isSuperAdmin ? '/super-admin/login' : '/login');
    }
  };
}
