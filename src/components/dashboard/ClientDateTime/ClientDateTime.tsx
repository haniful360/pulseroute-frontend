/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { FormatDateTime } from '@/utils/formatDateTime';
import { useEffect, useState } from 'react';

interface ClientDateTimeProps {
  dateString: string | null | undefined;
  fallback?: string;
}

export const ClientDateTime = ({ dateString, fallback = 'N/A' }: ClientDateTimeProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">Loading...</span>;
  }

  if (!dateString) return <span>{fallback}</span>;

  return <span>{FormatDateTime(dateString)}</span>;
};

export default ClientDateTime;
