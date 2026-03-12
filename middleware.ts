import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = [
    '/',
    '/about',
    '/pricing',
    '/templates',
    '/blog',
    '/contact',
    '/terms',
    '/privacy',
  ].includes(nextUrl.pathname);
  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(nextUrl.pathname);
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isApiRoute = nextUrl.pathname.startsWith('/api');

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (isApiRoute && !isApiAuthRoute) {
    // Add rate limiting headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    return response;
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Protect auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
