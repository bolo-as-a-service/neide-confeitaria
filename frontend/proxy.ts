import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Guarda de rotas /admin (INTERIM - issue #12).
 *
 * Lê o cookie legível `neide_auth_role` espelhado pelo AuthContext.
 * Quando o backend implementar JWT + cookie httpOnly (#16), este proxy
 * deve passar a validar o JWT (assinatura/expiração/role) em vez deste cookie.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const role = request.cookies.get("neide_auth_role")?.value;

  if (role !== "ADMIN") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
