"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Phone, User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DEFAULT_STORE_SETTINGS, loadStoreSettings } from "@/lib/store-settings";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
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

  const displayName = user?.name ? `Olá, ${user.name.split(" ")[0]}!` : "Olá, Neide!";
  const displayRole = user?.role === "ADMIN" ? "Administrador" : (user?.email ?? "Administrador");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-16">
        <span className="font-script text-[var(--brand-900)] text-2xl lg:text-3xl leading-none">
          Neide Confeitaria
        </span>

        <div className="hidden lg:flex items-center gap-3 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{settings.address}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{settings.openTime} - {settings.closeTime}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" />
            <span>{settings.phone}</span>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${settings.isOpen ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
            <span className={`w-2 h-2 rounded-full ${settings.isOpen ? "bg-green-500" : "bg-red-500"}`} />
            {settings.isOpen ? "ABERTO" : "FECHADO"}
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 lg:px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[var(--brand-800)] flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div className="leading-tight hidden sm:block text-left">
              <p className="text-sm font-semibold text-[var(--ink)]">{displayName}</p>
              <p className="text-xs text-[var(--muted)]">{displayRole}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
          </button>
          {open && (
            <div role="menu" className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg p-1.5 z-50">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
