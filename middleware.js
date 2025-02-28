import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests to /api/auth/[...nextauth] without a token check
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/register')
  ) {
    return NextResponse.next();
  }

  // Redirect any random/unknown paths to root
  // This needs to be before the role-based checks to catch truly random paths
  const validPaths = [
    '/',
    '/api',
    '/admindashboard',
    '/Canteendashboard',
    '/UserView',
    '/Cashierdashboard'
  ];

  const isValidPath = validPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  if (!isValidPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If there's no token for protected routes, redirect to home
  if (!token) {
    if (
      pathname.startsWith('/admindashboard') ||
      pathname.startsWith('/Canteendashboard') ||
      pathname.startsWith('/UserView') ||
      pathname.startsWith('/Cashierdashboard') ||
      pathname.startsWith('/api')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Role-based access control (only check if token exists)
  if (token) {
    if (pathname.startsWith('/admindashboard') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/Canteendashboard') && token.role !== 'canteenOwner') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/UserView') && token.role !== 'user') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/Cashierdashboard') && token.role !== 'cashier') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow users to continue to the requested page if role matches or path is not protected
  return NextResponse.next();
}

// Update the matcher to catch ALL paths, not just the specific ones
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};