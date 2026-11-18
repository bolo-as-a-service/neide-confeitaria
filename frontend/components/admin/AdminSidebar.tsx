"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Cake, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "menu-produtos",
    label: "Menu de Produtos",
    icon: <Cake className="h-5 w-5" />,
    href: "/admin/menu",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    icon: <ClipboardList className="h-5 w-5" />,
    href: "/admin/pedidos",
  },
  {
    id: "extra",
    label: "Extra",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/extra",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (item: SidebarItem) => {
      if (item.href === "/admin/menu") {
        return pathname === "/admin/menu";
      }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="hidden lg:flex w-60 bg-white border-r border-[var(--rose-200)] flex-col py-6 px-3 gap-1.5">
      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Confeitaria</p>
      {sidebarItems.map((item) => {
        const active = isActive(item);
        return (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative",
              active
                ? "bg-[var(--brand-900)] text-[var(--cream)] shadow-[0_10px_24px_-12px_rgba(43,21,20,0.7)]"
                : "text-[var(--muted)] hover:bg-[var(--rose-50)] hover:text-[var(--brand-900)]"
            )}
          >
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", active ? "bg-white/15 text-[var(--cream)]" : "bg-[var(--rose-100)] text-[var(--brand-700)]")}>
              {item.icon}
            </span>
            {item.label}
          </a>
        );
      })}
    </aside>
  );
}