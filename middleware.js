import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Simply return the response without performing any checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admindashboard/:path*',  // Match /admindashboard and all sub-paths
    '/Canteendashboard/:path*', // Match /Canteendashboard and all sub-paths
    '/UserView/:path*', // Match /UserView and all sub-paths
    '/Cashierdashboard/:path*',  // Match /Cashierdashboard and all sub-paths
    '/api/:path*',  // Match all API routes
    '/((?!api/register|api/auth|api/userExists|_next/static|_next/image|favicon.ico).*)', // Exclude certain paths from middleware
  ],
};
