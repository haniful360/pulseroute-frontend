/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export const useCreateAlertMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createAlert = (data: any) => {
    setIsLoading(true);
    const promise = (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return { data: { success: true, ...data } };
      } finally {
        setIsLoading(false);
      }
    })();

    return Object.assign(promise, {
      unwrap: async () => {
        const res = await promise;
        return res.data;
      },
    });
  };

  return [createAlert, { isLoading }] as const;
};
