import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'DRIVER' | 'USER';
  exp: number;
}

function parseJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const decoded: DecodedToken | null = accessToken ? parseJwt(accessToken) : null;
  const isTokenValid = decoded && decoded.exp * 1000 > Date.now();

  const isAuthRoute =
    pathname === '/login' ||
    pathname.startsWith('/register') ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isDashboardRoute = pathname.startsWith('/dashboard');

  // 1. If user is logged in and visits auth routes, redirect to their role-specific dashboard
  if (isTokenValid && isAuthRoute) {
    if (decoded.role === 'DRIVER') {
      return NextResponse.redirect(new URL('/dashboard/driver', request.url));
    }
    if (decoded.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/super-admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/patient', request.url));
  }

  // 2. If user is not logged in and tries to access dashboard, redirect to login
  if (!isTokenValid && isDashboardRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If accessing root /dashboard, redirect to specific role dashboard
  if (isTokenValid && (pathname === '/dashboard' || pathname === '/dashboard/')) {
    if (decoded.role === 'DRIVER') {
      return NextResponse.redirect(new URL('/dashboard/driver', request.url));
    }
    if (decoded.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/super-admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/patient', request.url));
  }

  // 4. Role-based route guard
  if (isTokenValid) {
    if (pathname.startsWith('/dashboard/super-admin') && decoded.role !== 'SUPER_ADMIN') {
      const target = decoded.role === 'DRIVER' ? '/dashboard/driver' : '/dashboard/patient';
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith('/dashboard/driver') && decoded.role !== 'DRIVER') {
      const target =
        decoded.role === 'SUPER_ADMIN' ? '/dashboard/super-admin' : '/dashboard/patient';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register/:path*',
    '/forgot-password',
    '/reset-password',
  ],
};
