"use client";

import { Ban, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["FILA", "APROVADO", "FAZENDO", "PRONTO", "ENTREGUE"] as const;

const STAGE_SHORT: Record<string, string> = {
  FILA: "Fila",
  APROVADO: "Aprovado",
  FAZENDO: "Preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
};

interface OrderTimelineProps {
  status: string;
}

/** Linha do tempo compacta do pedido (Fila → Entregue). */
export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === "CANCELADO") {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-100/80 px-3 py-2.5 text-xs font-semibold text-gray-600">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-white">
          <Ban className="h-3 w-3" strokeWidth={3} />
        </span>
        Pedido cancelado
      </div>
    );
  }

  const rawIndex = (STAGES as readonly string[]).indexOf(status);
  const current = rawIndex === -1 ? 0 : rawIndex;

  return (
    <ol
      className="mt-3 flex items-start"
      aria-label="Andamento do pedido"
    >
      {STAGES.map((stage, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <li key={stage} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  done || isCurrent
                    ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                    : "border-[var(--rose-200)] bg-white text-transparent"
                )}
                aria-current={isCurrent ? "step" : undefined}
                title={STAGE_SHORT[stage]}
              >
                {done ? (
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-0" />
                )}
              </span>
              <span
                className={cn(
                  "hidden text-[10px] font-semibold leading-tight min-[420px]:block",
                  done || isCurrent
                    ? "text-[var(--brand-800)]"
                    : "text-[var(--muted)]"
                )}
              >
                {STAGE_SHORT[stage]}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-1 mt-2.5 h-0.5 flex-1 rounded-full",
                  i < current
                    ? "bg-[var(--brand-700)]"
                    : "bg-[var(--rose-200)]"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
