"use client";

import * as React from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  observation?: string;
}

export interface Order {
  id: string;
  number: number;
  type: "RETIRADA" | "ENTREGA";
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  location?: string;
  items: OrderItem[];
  generalObservations?: string;
  total: number;
}

interface OrderCardProps {
  order: Order;
  variant: "fila" | "aprovados" | "fazendo" | "prontos" | "entregues" | "cancelados";
  onRecusar?: (order: Order) => void;
  onAceitar?: (order: Order) => void;
  onIniciarPreparo?: (order: Order) => void;
  onMarcarPronto?: (order: Order) => void;
  onMarcarEntregue?: (order: Order) => void;
}

const typeTagStyles: Record<string, string> = {
  RETIRADA: "bg-blue-100 text-blue-700 border-blue-200",
  ENTREGA: "bg-orange-100 text-orange-700 border-orange-200",
};

export function OrderCard({ order, variant, onRecusar, onAceitar, onIniciarPreparo, onMarcarPronto, onMarcarEntregue }: OrderCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_24px_-14px_rgba(75,40,32,0.35)] border border-[var(--rose-200)] p-4 space-y-3 card-lift">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--brand-900)]">Pedido #{order.number}</span>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border", typeTagStyles[order.type])}>
          {order.type}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">{order.customerName}</p>
        <p className="text-xs text-[var(--muted)]">{order.customerPhone}</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <Calendar className="h-3.5 w-3.5" />
        <span>{order.deliveryDate} - {order.deliveryTime}</span>
      </div>

      {order.location && (
        <div className="text-xs text-[var(--muted)]">
          <span className="font-semibold text-[var(--ink)]">LOCALIZAÇÃO</span>
          <p>{order.location}</p>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[var(--brand-700)] font-medium"
      >
        {expanded ? "Ocultar" : "Ver"} itens
        <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="space-y-1.5 rounded-xl bg-[var(--rose-50)]/70 p-2.5">
          {order.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs gap-2">
                <span className="text-[var(--ink)] truncate">
                  {item.quantity}x {item.name} <span className="text-[var(--muted)]">• {formattedPrice(item.price)}</span>
                </span>
              </div>
              {item.observation && (
                <p className="text-[11px] text-[var(--muted)] italic ml-2">&ldquo;{item.observation}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {order.generalObservations && (
        <div className="bg-[var(--rose-50)] border border-dashed border-[var(--rose-200)] rounded-xl p-2.5 text-xs text-[var(--brand-800)] italic">
          {order.generalObservations}
        </div>
      )}

      <div className="flex items-baseline justify-between pt-2 border-t border-dashed border-[var(--rose-200)]">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">Total</span>
        <span className="font-display text-base font-extrabold text-[var(--brand-800)]">{formattedPrice(order.total)}</span>
      </div>

      <div className="flex gap-2 pt-1">
        {variant === "fila" && (
          <>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => onRecusar?.(order)}
            >
              Recusar
            </Button>
            <Button
              className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAceitar?.(order)}
            >
              Aceitar
            </Button>
          </>
        )}
        {variant === "aprovados" && (
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => onIniciarPreparo?.(order)}
          >
            Iniciar preparo
          </Button>
        )}
        {variant === "fazendo" && (
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() => onMarcarPronto?.(order)}
          >
            Marcar como pronto
          </Button>
        )}
        {variant === "prontos" && (
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => onMarcarEntregue?.(order)}
          >
            Marcar como entregue
          </Button>
        )}
      </div>
    </div>
  );
}