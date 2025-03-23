import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
 
  return NextResponse.next();
  
   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  // Debugging: Log path being processed
  console.log("Middleware processing path:", pathname);
  
  //  Allow unauthenticated access to authentication and registration routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/register') ||
    pathname.startsWith('/api/userExists')
    
  ) {
    return NextResponse.next();
  }
  
  // ✅ Redirect unknown paths to root (ensures only valid paths are accessible)
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
  
  // ✅ If no token is present, redirect to home for protected routes
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
  
  // ✅ Role-based access control (only check if token exists)
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
  
  // ✅ Allow users to continue to the requested page if role matches or path is not protected
  return NextResponse.next();
  
}



export const config = {
  matcher: [
    '/((?!api/register|api/auth|api/userExists|_next/static|_next/image|favicon.ico).*)',
  ],
};
