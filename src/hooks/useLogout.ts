'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/services/auth.service';
import { toast } from 'sonner';

export function useLogout() {
  const router = useRouter();

  return async () => {
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };
}
