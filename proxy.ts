import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Intentar obtener nuestra "cookie de espejo"
  const sessionStatus = request.cookies.get('app_session_status')?.value;
  const isLoggedIn = sessionStatus === 'active';

  // 2. Definir rutas protegidas
  const protectedRoutes = ['/feed', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) => 
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. Si es protegida y NO hay señal de sesión -> Login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Si YA hay señal e intenta ir a auth -> Feed
  if (isLoggedIn && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};