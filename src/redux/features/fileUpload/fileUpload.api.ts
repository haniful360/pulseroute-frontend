/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export const useUploadSingleFileMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadSingle = (formData: FormData) => {
    setIsLoading(true);
    const promise = (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const file = formData.get('file') as File;
        const fakeUrl = file ? URL.createObjectURL(file) : 'https://placehold.co/600x400';
        return { data: fakeUrl };
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

  return [uploadSingle, { isLoading }] as const;
};

export const useUploadFilesMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadMultiple = (formData: FormData) => {
    setIsLoading(true);
    const promise = (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const files = formData.getAll('files') as File[];
        const urls = files.map((file) => URL.createObjectURL(file));
        return { data: urls };
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

  return [uploadMultiple, { isLoading }] as const;
};
