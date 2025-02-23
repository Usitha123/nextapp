import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests to /api/auth/[...nextauth] without a token check
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Block all other API calls if no token is found
  if (pathname.startsWith('/api') && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If there's no token for protected routes, redirect to home
  if (!token) {
    if (
      pathname.startsWith('/admindashboard') ||
      pathname.startsWith('/Canteendashboard') ||
      pathname.startsWith('/UserView') ||
      pathname.startsWith('/Cashierdashboard')
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

export const config = {
  matcher: [
    '/admindashboard/:path*',  // Match /admindashboard and all sub-paths
    '/Canteendashboard/:path*', // Match /Canteendashboard and all sub-paths
    '/UserView/:path*', // Match /UserView and all sub-paths
    '/Cashierdashboard/:path*',  // Match /Cashierdashboard and all sub-paths
    '/api/:path*',
  ],
};