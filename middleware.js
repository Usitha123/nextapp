import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Debug logging
  console.log('Middleware - Path:', pathname, 'Method:', req.method);

  // Early return for NextAuth API routes - always allow
  if (pathname.startsWith('/api/auth')) {
    console.log('Allowing NextAuth route:', pathname);
    return NextResponse.next();
  }

  // Early return for registration API routes - always allow
  if (pathname.startsWith('/api/register')) {
    console.log('Allowing register route:', pathname);
    return NextResponse.next();
  }

  // Allow userExists API route (used for registration validation)
  if (pathname.startsWith('/api/userExists')) {
    console.log('Allowing userExists route:', pathname);
    return NextResponse.next();
  }

  // Allow payment
  if (pathname.startsWith('/payment/complete')) {
    console.log('Allowing payment route:', pathname);
    return NextResponse.next();
  }

  // Allow payment
  if (pathname.startsWith('/payment/cancel')) {
    console.log('Allowing payment route:', pathname);
    return NextResponse.next();
  }

  // Handle other API routes
  if (pathname.startsWith('/api')) {
    // Block other API requests if no token
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Allow authenticated API requests
    return NextResponse.next();
  }

  // Define valid page routes (non-API)
  const validPageRoutes = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/admindashboard',
    '/Canteendashboard', 
    '/UserView',
    '/Cashierdashboard'
    // Add other valid page routes as needed
  ];

  // Check if current path is a valid page route
  const isValidPageRoute = validPageRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  // Allow Next.js internal routes and static files
  const isNextJsInternal = pathname.startsWith('/_next') || 
                          pathname.startsWith('/favicon') ||
                          /\.(ico|png|jpg|jpeg|gif|svg|webp)$/.test(pathname);

  // Redirect invalid page routes to home
  if (!isValidPageRoute && !isNextJsInternal) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Authentication checks for protected dashboard routes
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

  // Role-based access control for authenticated users
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};