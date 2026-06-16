"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Cake, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const mobileNavItems = [
  { label: "Produtos", icon: <Cake className="h-4 w-4" />, href: "/admin/menu" },
  { label: "Pedidos", icon: <ClipboardList className="h-4 w-4" />, href: "/admin/pedidos" },
  { label: "Extra", icon: <Settings className="h-4 w-4" />, href: "/admin/extra" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <nav className="flex lg:hidden gap-2 mb-4 pb-2 overflow-x-auto">
            {mobileNavItems.map((item) => {
              const active = item.href === "/admin/menu"
                ? pathname === "/admin/menu"
                : pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                    active
                      ? "bg-[var(--rose-100)] text-[var(--brand-800)]"
                      : "text-[var(--muted)] hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </a>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}