import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The real JWT is an httpOnly cookie set by the Render backend, a different
// domain from this Vercel frontend, so the browser never sends it to this
// server — proxy can't read it. `session` is a plain marker cookie the
// frontend sets itself on login/logout purely to gate navigation here; the
// backend's JwtAuthGuard remains the actual authorization boundary.
const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('session')?.value === 'true';
  const { pathname } = request.nextUrl;

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
