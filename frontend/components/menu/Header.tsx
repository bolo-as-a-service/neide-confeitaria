"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="relative">
      <div className="relative bg-[var(--brand-900)] text-[var(--cream)]">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="w-10 lg:w-44" />

            <a href="/cardapio">
              <span className="font-script text-2xl md:text-3xl whitespace-nowrap">
                Neide Confeitaria
              </span>
            </a>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-sm underline hover:text-[var(--rose-100)] transition-colors"
              >
                <User className="h-4 w-4" />
                Acessar Minha Conta
              </Link>
              <button
                onClick={onCartClick}
                className="relative flex items-center gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-[var(--cream)] px-3 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "relative h-16 w-full -mt-1",
          "bg-[var(--brand-900)]"
        )}
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
    </header>
  );
}