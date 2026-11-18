"use client";

import * as React from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { DEFAULT_STORE_SETTINGS, loadStoreSettings } from "@/lib/store-settings";

export function Footer() {
  const [settings, setSettings] = React.useState(DEFAULT_STORE_SETTINGS);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setSettings(loadStoreSettings());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-16">
      <div
        aria-hidden
        className="h-8 w-full bg-[var(--brand-900)]"
        style={{
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,64C240,110 480,20 720,55C960,90 1200,110 1440,60L1440,120L0,120Z'/%3E%3C/svg%3E\")",
          maskRepeat: "no-repeat",
          maskPosition: "top",
          maskSize: "100% 100%",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,64C240,110 480,20 720,55C960,90 1200,110 1440,60L1440,120L0,120Z'/%3E%3C/svg%3E\")",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "top",
          WebkitMaskSize: "100% 100%",
        }}
      />
      <div className="bg-[var(--brand-900)] text-[var(--cream)] texture-sprinkles -mt-1">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr] items-start">
          <div className="text-center md:text-left">
            <span className="font-script text-3xl text-white">
              {settings.storeName}
            </span>
            <p className="mt-2 text-sm text-[var(--rose-200)]/90 max-w-xs mx-auto md:mx-0">
              Bolos artesanais, doces e salgados feitos com carinho — do forno para a sua mesa.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 ring-1 ring-white/15 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${settings.isOpen ? "bg-green-400" : "bg-red-400"}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${settings.isOpen ? "bg-green-400" : "bg-red-400"}`} />
              </span>
              <span className="text-xs font-bold tracking-widest">{settings.isOpen ? "ABERTO AGORA" : "FECHADO"}</span>
              <span className="text-xs text-[var(--rose-200)]/80">{settings.openTime} – {settings.closeTime}</span>
            </div>
          </div>

          <nav className="flex flex-col items-center md:items-start gap-2 text-sm" aria-label="Navegação">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--rose-200)]/70 mb-1">Passeie</span>
            <a href="/cardapio" className="hover:text-white hover:underline underline-offset-4 transition-colors">Cardápio</a>
            <a href="/carrinho" className="hover:text-white hover:underline underline-offset-4 transition-colors">Carrinho</a>
            <a href="/meus-pedidos" className="hover:text-white hover:underline underline-offset-4 transition-colors">Meus pedidos</a>
            <a href="/login" className="hover:text-white hover:underline underline-offset-4 transition-colors">Minha conta</a>
          </nav>

          <div className="flex flex-col items-center md:items-start gap-2.5 text-sm text-[var(--rose-100)]">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--rose-200)]/70 mb-1">Onde nos encontrar</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{settings.openTime} - {settings.closeTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--rose-200)]/60">
          <span>&copy; {new Date().getFullYear()} Neide Confeitaria. Todos os direitos reservados.</span>
          <span className="font-script text-base text-[var(--rose-200)]/80">feito com açúcar & afeto</span>
        </div>
      </div>
      </div>
    </footer>
  );
}