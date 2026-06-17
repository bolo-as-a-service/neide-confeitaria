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
  variant: "fila" | "aprovados" | "fazendo" | "prontos";
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--ink)]">Pedido #{order.number}</span>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", typeTagStyles[order.type])}>
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
        <div className="space-y-1.5">
          {order.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--ink)]">
                  {item.name} <span className="text-[var(--muted)]">({item.quantity}x • {formattedPrice(item.price)})</span>
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
        <div className="bg-gray-50 rounded-lg p-2 text-xs text-[var(--muted)] italic">
          {order.generalObservations}
        </div>
      )}

      <div className="text-sm font-bold text-[var(--brand-800)] pt-1 border-t border-gray-100">
        {formattedPrice(order.total)}
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