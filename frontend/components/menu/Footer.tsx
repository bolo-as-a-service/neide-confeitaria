"use client";

import * as React from "react";
import { MapPin, Clock, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-900)] text-[var(--cream)] mt-12">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-script text-2xl text-white">
              Neide Confeitaria
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-[var(--rose-100)]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Bragança Paulista Rua 7</span>
            </div>
            <span className="hidden sm:inline text-[var(--brand-600)]">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>08:00 - 20:00</span>
            </div>
            <span className="hidden sm:inline text-[var(--brand-600)]">|</span>
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>(11) 9 4022-8922</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-800/40 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm font-medium">ABERTO</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--brand-700)] text-center text-xs text-[var(--brand-600)]">
          &copy; {new Date().getFullYear()} Neide Confeitaria. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}