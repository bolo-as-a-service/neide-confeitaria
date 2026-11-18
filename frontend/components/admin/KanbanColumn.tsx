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
  variant: "fila" | "aprovados" | "fazendo" | "prontos" | "entregues" | "cancelados";
  onRecusar?: (order: Order) => void;
  onAceitar?: (order: Order) => void;
  onIniciarPreparo?: (order: Order) => void;
  onMarcarPronto?: (order: Order) => void;
  onMarcarEntregue?: (order: Order) => void;
}

const headerStyles: Record<string, string> = {
  fila: "bg-amber-100/80 text-amber-900",
  aprovados: "bg-blue-100/80 text-blue-900",
  fazendo: "bg-orange-100/80 text-orange-900",
  prontos: "bg-green-100/80 text-green-900",
  entregues: "bg-teal-100/80 text-teal-900",
  cancelados: "bg-stone-200/70 text-stone-600",
};

const countStyles: Record<string, string> = {
  fila: "bg-[var(--brand-900)] text-[var(--cream)]",
  aprovados: "bg-blue-600 text-white",
  fazendo: "bg-orange-500 text-white",
  prontos: "bg-green-600 text-white",
  entregues: "bg-teal-600 text-white",
  cancelados: "bg-stone-400 text-white",
};

const bodyStyles: Record<string, string> = {
  fila: "bg-[var(--rose-50)]/70",
  aprovados: "bg-blue-50/50",
  fazendo: "bg-orange-50/50",
  prontos: "bg-green-50/50",
  entregues: "bg-teal-50/50",
  cancelados: "bg-stone-100/60",
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
    <div className="flex-shrink-0 w-[calc(100vw-4.5rem)] max-w-80 sm:w-80 flex flex-col rounded-[var(--radius-card)] overflow-hidden border border-[var(--rose-200)] bg-white shadow-[0_10px_28px_-16px_rgba(75,40,32,0.35)]">
      <div className={cn("flex items-center gap-2 px-4 py-3 border-b border-black/5", headerStyles[variant])}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[11px] opacity-70 truncate">{subtitle}</p>
        </div>
        <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", countStyles[variant])}>
          {count}
        </span>
      </div>

      <div className={cn("flex-1 p-3 space-y-3 overflow-y-auto min-h-[120px] max-h-[70vh] texture-dots-light", bodyStyles[variant])}>
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
          <div className="text-center py-10 px-4">
            <p className="font-script text-2xl text-[var(--muted)]/70">vazio por aqui</p>
            <p className="text-xs text-center text-[var(--muted)]">Nenhum pedido nesta etapa</p>
          </div>
        )}
      </div>
    </div>
  );
}