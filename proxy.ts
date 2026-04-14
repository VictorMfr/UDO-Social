import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Intentar obtener la cookie de sesión
  const token = request.cookies.get('auth_token')?.value;

  // 2. Definir qué rutas queremos proteger
  // En este caso, todas las que empiecen por /feed o /profile
  const protectedRoutes = ['/feed', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) => 
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Opcional: pasar la ruta a la que intentaba ir como parámetro
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Si el usuario está logueado e intenta ir al login o register, 
  // enviarlo directamente al feed
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Si todo está bien, permitir que la petición continúe
  return NextResponse.next();
}

// CONFIGURACIÓN DEL MATCHER
// Esto le dice a Next.js en qué rutas debe ejecutarse este middleware
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * 1. /api (rutas de API de Next.js si las usas)
     * 2. /_next (archivos internos de Next.js)
     * 3. /static (archivos estáticos)
     * 4. favicon.ico, sitemap.xml, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};