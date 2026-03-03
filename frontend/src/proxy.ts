import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // The Express backend sets this HttpOnly cookie upon successful login
    const token = request.cookies.get('accessToken')?.value;

    // Define protected path prefixes
    const authRoutes = [
        '/account',
        '/checkout',
        '/seller/dashboard',
        '/seller/settings',
        '/seller/products',
        '/seller/orders',
        '/seller/analytics'
    ];

    // Check if the current path starts with any of the protected prefixes
    const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Redirect unauthenticated users to the homepage
    if (isAuthRoute && !token) {
        const url = new URL('/', request.url);
        // We could append ?login=true here, but simple redirect is cleaner for edge caching
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
