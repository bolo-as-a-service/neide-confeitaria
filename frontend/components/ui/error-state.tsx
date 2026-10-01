"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="font-display text-lg font-bold text-[var(--ink)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-5 rounded-full px-6">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
