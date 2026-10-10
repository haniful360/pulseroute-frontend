'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { googleLoginAction } from '@/services/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface GoogleLoginButtonProps {
  text?: 'continue_with' | 'signin_with' | 'signup_with';
  redirectUrl?: string | null;
  onSuccess?: () => void;
  className?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  text = 'continue_with',
  redirectUrl,
  onSuccess,
  className = '',
}) => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // Keep latest callback dependencies in refs to prevent unnecessary SDK re-initializations
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const redirectUrlRef = useRef(redirectUrl);
  redirectUrlRef.current = redirectUrl;

  const handleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        toast.error('Google did not return an authorization token.');
        return;
      }

      setIsVerifying(true);

      // 20-second safety timeout so the spinner never spins forever
      const timeoutId = setTimeout(() => {
        setIsVerifying(false);
        toast.error('Google authentication timed out. Please try again.');
      }, 20000);

      try {
        const res = await googleLoginAction({ idToken: response.credential });
        clearTimeout(timeoutId);

        if (!res.success || !res.data) {
          toast.error(res.message || 'Google authentication failed.');
          setIsVerifying(false);
          return;
        }

        toast.success(res.message || 'Logged in with Google successfully!');
        await refreshUser();

        if (onSuccessRef.current) {
          onSuccessRef.current();
          setIsVerifying(false);
          return;
        }

        const targetUrl =
          redirectUrlRef.current && redirectUrlRef.current !== '/dashboard/super-admin'
            ? redirectUrlRef.current
            : res.data.user.role === 'DRIVER'
              ? '/dashboard/driver'
              : res.data.user.role === 'SUPER_ADMIN'
                ? '/dashboard/super-admin/overview'
                : '/dashboard/patient';

        // Clean client redirect with newly acquired session cookies
        window.location.href = targetUrl;
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        console.error('Google login processing error:', err);
        const msg =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred during Google sign-in.';
        toast.error(msg);
        setIsVerifying(false);
      }
    },
    [refreshUser]
  );

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in .env');
      return;
    }

    let isMounted = true;

    const renderGoogleButton = () => {
      const g = (window as unknown as { google?: { accounts?: { id?: {
        initialize: (config: unknown) => void;
        renderButton: (parent: HTMLElement, options: unknown) => void;
      } } } })?.google;

      if (!g?.accounts?.id || !buttonContainerRef.current) {
        return false;
      }

      try {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        buttonContainerRef.current.innerHTML = '';
        const parentWidth = buttonContainerRef.current.parentElement?.offsetWidth || 360;
        const targetWidth = Math.min(Math.max(parentWidth, 240), 400);

        g.accounts.id.renderButton(buttonContainerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'left',
          width: targetWidth,
        });

        if (isMounted) {
          setIsSdkLoaded(true);
        }
        return true;
      } catch (err) {
        console.error('Failed to initialize Google Identity Services:', err);
        return false;
      }
    };

    const g = (window as unknown as { google?: { accounts?: { id?: unknown } } })?.google;
    if (g?.accounts?.id) {
      renderGoogleButton();
    } else {
      const existingScript = document.getElementById('google-gsi-client');
      if (existingScript) {
        existingScript.addEventListener('load', renderGoogleButton);
      } else {
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderGoogleButton();
        };
        script.onerror = () => {
          console.error('Failed to load Google Identity Services SDK script');
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [handleCredentialResponse, text]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Active loading state overlay */}
      {isVerifying && (
        <div className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span>Verifying Google Account...</span>
        </div>
      )}

      {/* Button container - kept mounted in the DOM to avoid detached iframe issues */}
      <div
        ref={buttonContainerRef}
        className={`w-full flex justify-center items-center ${isVerifying ? 'hidden' : 'flex'}`}
        style={{ minHeight: '44px' }}
      />

      {/* Initial placeholder while SDK is fetching */}
      {!isSdkLoaded && !isVerifying && (
        <div className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm animate-pulse">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
