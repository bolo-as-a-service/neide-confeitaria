"use client";

import { motion } from "framer-motion";
import { PartyPopper, Truck } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD, remainingForFreeShipping } from "@/lib/checkout";
import { formatBRL } from "@/components/ui/price";

interface FreeShippingProgressProps {
  subtotal: number;
}

/** Barra de progresso para o frete grátis na sacola. */
export function FreeShippingProgress({ subtotal }: FreeShippingProgressProps) {
  const remaining = remainingForFreeShipping(subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD);

  if (remaining <= 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl bg-green-50 border border-green-200 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shrink-0">
          <PartyPopper className="h-4 w-4" />
        </span>
        <p className="text-xs font-bold text-green-800">
          Você ganhou frete grátis!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--rose-50)] border border-[var(--rose-200)] px-4 py-3">
      <div className="flex items-center gap-2 text-xs">
        <Truck className="h-4 w-4 text-[var(--brand-700)] shrink-0" />
        <p className="text-[var(--brand-900)]">
          Faltam <strong>{formatBRL(remaining)}</strong> para o frete grátis
        </p>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--rose-200)]/70"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_THRESHOLD}
        aria-valuenow={Math.round(subtotal)}
        aria-label="Progresso para frete grátis"
      >
        <motion.div
          className="h-full rounded-full bg-[var(--brand-700)]"
          initial={false}
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--muted)]">
        Frete grátis em entregas acima de {formatBRL(FREE_DELIVERY_THRESHOLD)}
      </p>
    </div>
  );
}
