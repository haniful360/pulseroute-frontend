'use client';

import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  return () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };
}
