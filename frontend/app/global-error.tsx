"use client";

/** Boundary raiz (issue #26): precisa de html/body próprios. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "system-ui, sans-serif",
            padding: 24,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Algo deu errado</h2>
          <p style={{ color: "#666" }}>Ocorreu um erro inesperado. Tente novamente.</p>
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              border: "none",
              background: "#7c2d12",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
