"use client";

import * as React from "react";
import { ErrorState } from "@/components/ui/error-state";

/** Boundary de erro por rota (issue #26): exibe ErrorState com retry. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body flex items-center justify-center px-4">
      <ErrorState
        title="Algo deu errado"
        message={error.message || "Ocorreu um erro inesperado nesta página."}
        onRetry={reset}
      />
    </div>
  );
}
