"use client";

import { cn } from "@/lib/utils";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  FILA: "Na fila",
  APROVADO: "Aprovado",
  FAZENDO: "Em preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  FILA: "bg-amber-100 text-amber-800 border-amber-200",
  APROVADO: "bg-blue-100 text-blue-800 border-blue-200",
  FAZENDO: "bg-orange-100 text-orange-800 border-orange-200",
  PRONTO: "bg-green-100 text-green-800 border-green-200",
  ENTREGUE: "bg-teal-100 text-teal-800 border-teal-200",
  CANCELADO: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_DOT: Record<string, string> = {
  FILA: "bg-amber-500",
  APROVADO: "bg-blue-500",
  FAZENDO: "bg-orange-500",
  PRONTO: "bg-green-500",
  ENTREGUE: "bg-teal-600",
  CANCELADO: "bg-gray-400",
};

interface StatusPillProps {
  status: string;
  className?: string;
}

/** Selo de status do pedido — rótulo, cor e ponto centralizados aqui. */
export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border",
        STATUS_STYLES[status] ??
          "bg-[var(--rose-100)] text-[var(--brand-800)] border-[var(--rose-200)]",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          STATUS_DOT[status] ?? "bg-[var(--brand-700)]"
        )}
      />
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
