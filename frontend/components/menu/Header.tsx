"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, ShoppingBag, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/cardapio");
  };
  return (
    <header className="sticky top-0 z-40">
      <div className="relative bg-[var(--brand-900)] text-[var(--cream)] texture-sprinkles shadow-[0_10px_30px_-14px_rgba(43,21,20,0.55)]">
        <div className="max-w-[1400px] mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1" />

            <a href="/cardapio" className="group -my-2 flex items-center gap-2 py-2" aria-label="Neide Confeitaria — cardápio">
              <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--cream)]/12 pt-0.5 font-script text-lg leading-none ring-1 ring-white/20 transition-transform group-hover:scale-105 min-[360px]:flex min-[360px]:h-9 min-[360px]:w-9 min-[360px]:text-xl">
                N
              </span>
              <span className="whitespace-nowrap pt-1 font-script text-xl leading-none min-[360px]:text-2xl md:text-[1.7rem]">
                Neide Confeitaria
              </span>
            </a>

            <div className="flex flex-1 items-center justify-end gap-2">
              {!isLoading && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-white/10 ring-1 ring-white/25 transition-all hover:bg-white/20 md:w-auto md:justify-start md:py-1.5 md:pl-1.5 md:pr-2.5"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label={`Abrir menu da conta de ${user.name}`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cream)] font-display text-sm font-bold text-[var(--brand-900)]">
                      {(user.name || "N").charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-28 truncate text-sm font-semibold md:inline">
                      {user.role === "ADMIN" ? "Painel Admin" : user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className={`hidden h-4 w-4 opacity-70 transition-transform md:block ${menuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {menuOpen && (
                    <>
                      <button
                        type="button"
                        aria-hidden
                        tabIndex={-1}
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 z-10 cursor-default"
                      />
                      <div
                        role="menu"
                        className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--rose-200)] bg-white text-[var(--ink)] shadow-xl"
                      >
                        <div className="border-b border-[var(--rose-200)]/70 bg-[var(--rose-50)]/60 px-4 py-3">
                          <p className="truncate text-sm font-bold text-[var(--brand-900)]">{user.name}</p>
                          <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            role="menuitem"
                            href={user.role === "ADMIN" ? "/admin" : "/meus-pedidos"}
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--rose-100)] transition-colors"
                          >
                            <User className="h-4 w-4" />
                            {user.role === "ADMIN" ? "Painel Admin" : "Meus pedidos"}
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Entrar na conta"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-semibold ring-1 ring-white/25 transition-all hover:bg-white/15 md:w-auto md:gap-2 md:px-4"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Entrar</span>
                </Link>
              )}
              <span aria-hidden className="hidden h-6 w-px bg-white/20 sm:block" />
              <button
                onClick={onCartClick}
                className="relative flex h-10 items-center gap-2 bg-[var(--cream)] text-[var(--brand-900)] hover:bg-white px-4 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all hover:-translate-y-px"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--brand-700)] text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-[var(--brand-900)]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Onda: fundo opaco atrás da máscara para o conteúdo rolado não vazar pelos vales */}
      <div className="relative h-10 w-full -mt-1 bg-[var(--page-bg)]">
        <div
          className="absolute inset-0 bg-[var(--brand-900)]"
          style={{
            maskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,96L60,122.7C120,149,240,203,360,197.3C480,192,600,128,720,112C840,96,960,128,1080,133.3C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'/%3E%3C/svg%3E\")",
            maskRepeat: "no-repeat",
            maskPosition: "bottom",
            maskSize: "100% 100%",
            WebkitMaskImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,96L60,122.7C120,149,240,203,360,197.3C480,192,600,128,720,112C840,96,960,128,1080,133.3C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'/%3E%3C/svg%3E\")",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "bottom",
            WebkitMaskSize: "100% 100%",
          }}
        />
      </div>
    </header>
  );
}