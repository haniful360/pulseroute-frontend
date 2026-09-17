import React from 'react';
import Link from 'next/link';
import { PulseRouteLogo } from '@/components/shared/Logo/PulseRouteLogo';
import { ArrowLeft } from 'lucide-react';

interface AuthHeaderProps {
  subtitle?: string;
  showBackHome?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  subtitle = 'Emergency Dispatch',
  showBackHome = true,
}) => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-8">
      <PulseRouteLogo subtitle={subtitle} />

      {showBackHome && (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      )}
    </header>
  );
};
