import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "gobio_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (pathname !== "/login" && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/familias/:path*",
    "/tipos-producto/:path*",
    "/productos/:path*",
    "/ventas/:path*",
    "/configuracion/:path*",
    "/reporte/:path*",
    "/matriz-forecast/:path*",
    "/login",
  ],
};
