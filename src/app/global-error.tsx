'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased m-0 p-0 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-[#e63946] text-2xl font-black">
            !
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Application Critical Error</h1>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              PulseRoute encountered an unrecoverable system exception. Please reload the application.
            </p>
          </div>
          {error?.digest && (
            <p className="font-mono text-[11px] text-slate-400 bg-slate-100 p-2 rounded-lg">
              Digest: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-xl bg-[#e63946] py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            Reload PulseRoute
          </button>
        </div>
      </body>
    </html>
  );
}
