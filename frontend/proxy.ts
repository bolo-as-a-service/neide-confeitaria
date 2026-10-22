import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Guarda de rotas /admin (UX, não barreira de segurança).
 *
 * Lê o cookie legível `neide_auth_role` espelhado pelo AuthContext apenas
 * para redirecionar cedo para /login. A autorização real acontece no
 * backend: endpoints administrativos exigem JWT com papel ADMIN e o papel
 * exibido no frontend vem do GET /auth/me (lido do banco). Um cookie
 * forjado permite ver o shell do admin, mas nenhuma operação passa no
 * servidor sem token válido.
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
