"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { BackendUser } from "@/lib/types";

export type AuthUser = BackendUser;

const STORAGE_KEY = "neide_user";
const LEGACY_STORAGE_KEY = "user";
const ROLE_COOKIE = "neide_auth_role";
const FLAG_COOKIE = "neide_auth";

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.sessionStorage.getItem(STORAGE_KEY) ??
      // Compatibilidade com versão anterior que salvava em "user" no localStorage
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed.email !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeAuthCookie(user: AuthUser | null, remember: boolean) {
  if (typeof document === "undefined") return;
  // Cookie legível pelo middleware (Next) para guarda de /admin.
  // INTERIM: o backend ainda não emite JWT (#16). Quando o JWT existir,
  // o backend deve setar cookie httpOnly seguro e este mecanismo será removido.
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

function persistUser(user: AuthUser | null, remember: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  if (user) {
    const raw = JSON.stringify(user);
    if (remember) {
      window.localStorage.setItem(STORAGE_KEY, raw);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, raw);
    }
  }
  writeAuthCookie(user, remember);
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

  React.useEffect(() => {
    let cancelled = false;
    // Hidrata fora do corpo síncrono do efeito (evita set-state-in-effect).
    queueMicrotask(() => {
      if (cancelled) return;
      setUser(readStoredUser());
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(
    async (dto: { email: string; password: string }, remember = false) => {
      const logged = await api.login(dto);
      persistUser(logged, remember);
      setUser(logged);
      return logged;
    },
    []
  );

  const logout = React.useCallback(() => {
    persistUser(null, false);
    setUser(null);
  }, []);

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
      router.replace("/login?next=/admin");
    }
  }, [user, isAdmin, isLoading, router]);

  return { user, isLoading, isAdmin };
}
