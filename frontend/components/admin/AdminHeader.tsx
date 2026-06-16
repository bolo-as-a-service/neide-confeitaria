"use client";

import * as React from "react";
import { MapPin, Clock, Phone, User, ChevronDown } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-16">
        <span className="font-script text-[var(--brand-900)] text-2xl lg:text-3xl leading-none">
          Neide Confeitaria
        </span>

        <div className="hidden lg:flex items-center gap-3 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>Bragança Paulista Rua 7</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>xx:xx - yy:yy</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" />
            <span>(11) 9 4022-8922</span>
          </div>
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            ABERTO
          </span>
        </div>

        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 lg:px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[var(--brand-800)] flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-sm font-semibold text-[var(--ink)]">Olá, Neide!</p>
            <p className="text-xs text-[var(--muted)]">Administrador</p>
          </div>
          <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
        </div>
      </div>
    </header>
  );
}
