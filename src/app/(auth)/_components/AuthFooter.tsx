import React from 'react';
import { Phone } from 'lucide-react';

interface AuthFooterProps {
  supportEmail?: string;
  className?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  supportEmail = 'support@pulseroute.com',
  className = '',
}) => {
  return (
    <footer
      className={`mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 border-t border-slate-100 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-8 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-[10px] font-bold text-rose-500">
          ?
        </span>
        <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
          Need Help?
        </span>
        <a
          href={`mailto:${supportEmail}`}
          className="font-semibold text-slate-700 transition-colors hover:text-red-600"
        >
          {supportEmail}
        </a>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="tel:16244"
          className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-red-600"
        >
          <Phone className="h-3.5 w-3.5 text-red-500" />
          <span>
            HOTLINE: <strong className="font-semibold text-slate-800">16244</strong>
          </span>
        </a>
        <span className="text-slate-400">© 2024 PULSEROUTE INC.</span>
      </div>
    </footer>
  );
};
