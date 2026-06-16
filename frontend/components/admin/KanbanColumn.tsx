"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { OrderCard, Order } from "@/components/admin/OrderCard";

interface KanbanColumnProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  count: number;
  orders: Order[];
  variant: "fila" | "aprovados" | "fazendo" | "prontos";
  onRecusar?: (order: Order) => void;
  onAceitar?: (order: Order) => void;
  onIniciarPreparo?: (order: Order) => void;
  onMarcarPronto?: (order: Order) => void;
  onMarcarEntregue?: (order: Order) => void;
}

const headerStyles: Record<string, string> = {
  fila: "bg-[var(--rose-100)] text-[var(--brand-800)]",
  aprovados: "bg-yellow-50 text-yellow-800",
  fazendo: "bg-blue-50 text-blue-800",
  prontos: "bg-green-50 text-green-800",
};

const countStyles: Record<string, string> = {
  fila: "bg-[var(--brand-700)] text-white",
  aprovados: "bg-yellow-500 text-white",
  fazendo: "bg-blue-500 text-white",
  prontos: "bg-green-500 text-white",
};

const bodyStyles: Record<string, string> = {
  fila: "bg-[var(--rose-50)]",
  aprovados: "bg-yellow-50/50",
  fazendo: "bg-blue-50/50",
  prontos: "bg-green-50/50",
};

export function KanbanColumn({
  title,
  subtitle,
  icon,
  count,
  orders,
  variant,
  onRecusar,
  onAceitar,
  onIniciarPreparo,
  onMarcarPronto,
  onMarcarEntregue,
}: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col rounded-xl overflow-hidden border border-gray-200">
      <div className={cn("flex items-center gap-2 px-4 py-3", headerStyles[variant])}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[11px] opacity-70 truncate">{subtitle}</p>
        </div>
        <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", countStyles[variant])}>
          {count}
        </span>
      </div>

      <div className={cn("flex-1 p-3 space-y-3 overflow-y-auto", bodyStyles[variant])}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            variant={variant}
            onRecusar={onRecusar}
            onAceitar={onAceitar}
            onIniciarPreparo={onIniciarPreparo}
            onMarcarPronto={onMarcarPronto}
            onMarcarEntregue={onMarcarEntregue}
          />
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-center py-8 text-[var(--muted)]">Nenhum pedido</p>
        )}
      </div>
    </div>
  );
}