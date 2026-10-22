"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api, getAuthToken, setAuthToken, setOnUnauthorized } from "@/lib/api";
import type { BackendUser } from "@/lib/types";

export type AuthUser = BackendUser;

const ROLE_COOKIE = "neide_auth_role";
const FLAG_COOKIE = "neide_auth";

/**
 * Espelho legível do papel para o proxy (`proxy.ts`) dar UX de redirect.
 * NÃO é barreira de segurança: a autorização real acontece no backend
 * (endpoints exigem JWT; o papel exibido aqui vem do GET /auth/me,
 * lido do banco a cada carregamento).
 */
function writeAuthCookie(user: AuthUser | null, remember: boolean) {
  if (typeof document === "undefined") return;
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 dias se "lembrar"
  const attrs = `path=/; SameSite=Lax${maxAge ? `; Max-Age=${maxAge}` : ""}`;
  if (user) {
    document.cookie = `${FLAG_COOKIE}=1; ${attrs}`;
    document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role ?? "")}; ${attrs}`;
  } else {
    document.cookie = `${FLAG_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${ROLE_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (dto: { email: string; password: string }, remember?: boolean) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const logout = React.useCallback(() => {
    setAuthToken(null, false);
    setUser(null);
    writeAuthCookie(null, false);
  }, []);

  // Desloga globalmente em 401 (token expirado/inválido).
  React.useEffect(() => {
    setOnUnauthorized(() => logout());
    return () => setOnUnauthorized(null);
  }, [logout]);

  // Valida a sessão com o servidor: papel vem do banco, não do navegador.
  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(async () => {
      try {
        if (!getAuthToken()) {
          if (!cancelled) setUser(null);
          return;
        }
        const { user: me } = await api.getMe();
        if (!cancelled) {
          setUser(me);
          writeAuthCookie(me, true);
        }
      } catch {
        setAuthToken(null, false);
        if (!cancelled) {
          setUser(null);
          writeAuthCookie(null, false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(
    async (dto: { email: string; password: string }, remember = false) => {
      const { token, user: logged } = await api.login(dto);
      setAuthToken(token, remember);
      setUser(logged);
      writeAuthCookie(logged, remember);
      return logged;
    },
    []
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "ADMIN",
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}

export function useRequireAdmin() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();

  React.useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, isAdmin, isLoading, router]);

  return { user, isLoading, isAdmin };
}
