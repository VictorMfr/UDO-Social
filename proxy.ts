import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Detección de dispositivo
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // 2. Lógica de bloqueo/desbloqueo de dispositivo
  if (isMobile) {
    // Si es móvil y no está en la página de error, redirigir
    if (pathname !== '/desktop-only') {
      return NextResponse.redirect(new URL('/desktop-only', request.url));
    }
    // Si es móvil y está en /desktop-only, permitir que vea la página
    return NextResponse.next();
  } else {
    // SI ES ESCRITORIO y trata de entrar a /desktop-only, mandarlo fuera
    if (pathname === '/desktop-only') {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
  }

  // 3. Verificación de sesión (Cookie de espejo)
  const sessionStatus = request.cookies.get('app_session_status')?.value;
  const isLoggedIn = sessionStatus === 'active';

  // 4. Definir rutas protegidas
  const protectedRoutes = ['/feed', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // 5. Si es protegida y NO hay señal de sesión -> Login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Si YA hay señal e intenta ir a auth -> Feed
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};