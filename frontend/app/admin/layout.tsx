"use client";

import { usePathname } from "next/navigation";
import { Cake, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useRequireAdmin } from "@/lib/auth-context";

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
  const { user, isLoading, isAdmin } = useRequireAdmin();

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-dvh bg-[var(--page-bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Verificando acesso…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--page-bg)] flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <nav className="mb-4 grid grid-cols-3 gap-2 pb-2 lg:hidden">
            {mobileNavItems.map((item) => {
              const active = item.href === "/admin/menu"
                ? pathname === "/admin/menu"
                : pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-full px-1 py-2 text-[11px] font-bold transition-all min-[360px]:flex-row min-[360px]:gap-1.5 min-[360px]:px-2 min-[360px]:text-xs",
                    active
                      ? "bg-[var(--brand-900)] text-[var(--cream)] shadow-md"
                      : "bg-white border border-[var(--rose-200)] text-[var(--muted)] hover:text-[var(--brand-900)]"
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