import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_CUSTOMER = ['/dashboard'];
const PROTECTED_MERCHANT = ['/merchant/dashboard'];
const AUTH_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  const isProtected =
    PROTECTED_CUSTOMER.some((p) => pathname.startsWith(p)) ||
    PROTECTED_MERCHANT.some((p) => pathname.startsWith(p));

  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/merchant/dashboard/:path*', '/login', '/signup'],
};
