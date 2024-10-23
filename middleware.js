import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Get the token of the session
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // If no token is found and trying to access protected pages, redirect to login
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/opencanteen') || pathname.startsWith('/admindashboard') || pathname.startsWith('/opencanteendashboard'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Role-based access control for admindashboard
 if (pathname.startsWith('/admindashboard')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } 

  // Role-based access control for opencanteendashboard
  if (pathname.startsWith('/opencanteendashboard')) {
    if (!token || token.role !== 'canteen_owner') { // Adjust 'canteen_owner' to the specific role you want to check
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to the desired routes
export const config = {
  matcher: ['/dashboard/:path*', '/opencanteen/:path*', '/admindashboard/:path*', '/opencanteendashboard/:path*'],
};
