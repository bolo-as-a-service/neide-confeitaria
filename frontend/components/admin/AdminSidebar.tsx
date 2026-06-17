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
    <aside className="hidden lg:flex w-60 bg-gray-50 border-r border-gray-200 flex-col py-6 px-3 gap-1">
      {sidebarItems.map((item) => {
        const active = isActive(item);
        return (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
              active
                ? "bg-[var(--rose-100)] text-[var(--brand-800)] border-l-4 border-red-500"
                : "text-[var(--muted)] hover:bg-gray-100 hover:text-[var(--ink)] border-l-4 border-transparent"
            )}
          >
            <span className={cn(active ? "text-[var(--brand-800)]" : "text-[var(--muted)]")}>
              {item.icon}
            </span>
            {item.label}
          </a>
        );
      })}
    </aside>
  );
}