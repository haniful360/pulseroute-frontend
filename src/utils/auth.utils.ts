/**
 * Retrieves the base API URL, falling back to 'https://api.agentarum.ai/v1' if not set in env.
 */
export const getBaseApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BASE_API || 'https://api.agentarum.ai/v1';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`;
};

/**
 * Constructs the dynamic Google OAuth entry endpoint.
 */
export const getGoogleAuthUrl = (): string => {
  const baseUrl = getBaseApiUrl();
  return `${baseUrl}/auth/google`;
};

/**
 * Initiates Google OAuth login flow by saving the target redirect destination
 * and redirecting the browser to the backend Google OAuth endpoint.
 */
export const handleGoogleLoginRedirect = (redirectUrl?: string | null): void => {
  if (typeof window !== 'undefined') {
    if (redirectUrl) {
      sessionStorage.setItem('google_login_redirect', redirectUrl);
    }
    window.location.href = getGoogleAuthUrl();
  }
};
