'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DynamicBackBtnProps {
  label?: string;
}

export default function DynamicBackBtn({ label = 'Back Now' }: DynamicBackBtnProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-all duration-300 active:scale-95 sm:text-base"
    >
      <ChevronLeft size={18} />
      {label}
    </button>
  );
}
