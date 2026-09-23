'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useSetSearchQueryInURL() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQuery = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '' || value === null || value === undefined) {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const deleteQuery = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return { setQuery, deleteQuery, searchParams };
}
