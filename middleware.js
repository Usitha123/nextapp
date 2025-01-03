import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // If no token is found, redirect to root page
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { pathname } = req.nextUrl;

  // Protect specific pages based on user roles
  /*if (pathname.startsWith('/admindashboard') && token.role !== 'admin') {
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
  } */

  // Allow users to continue to the requested page if role matches
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*'/admindashboard/:path*',  // Match /admindashboard and all sub-paths
    '/Canteendashboard/:path*', // Match /Canteendashboard and all sub-paths
    '/UserView/:path*', // Match /UserView and all sub-paths
    '/Cashierdashboard/:path*',  // Match /UserView and all sub-paths*/
  ],
};