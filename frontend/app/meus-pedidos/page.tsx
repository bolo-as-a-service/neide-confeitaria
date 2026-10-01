"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackageSearch } from "lucide-react";
import { Header } from "@/components/menu/Header";
import { Footer } from "@/components/menu/Footer";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { BackendOrder } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  FILA: "Na fila",
  APROVADO: "Aprovado",
  FAZENDO: "Em preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function orderTotal(o: BackendOrder): number {
  return (o.items ?? []).reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export default function MeusPedidosPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = React.useState<BackendOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.getOrdersByCustomer(user.name);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/meus-pedidos");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [user, load]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Verificando acesso…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-body">
      <Header cartCount={0} onCartClick={() => router.push("/carrinho")} />

      <main className="max-w-[1020px] mx-auto px-4 sm:px-6 py-6 pb-12">
        <h1 className="font-display text-2xl font-bold text-[var(--brand-900)]">Meus pedidos</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Acompanhe os pedidos feitos como {user.name}
        </p>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-700)]" />
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-[var(--rose-200)]">
              <PackageSearch className="h-10 w-10 text-[var(--muted)] mb-3" />
              <p className="text-[var(--muted)]">Você ainda não fez nenhum pedido.</p>
              <button
                onClick={() => router.push("/cardapio")}
                className="mt-2 text-sm text-[var(--brand-700)] underline hover:text-[var(--brand-800)] transition-colors"
              >
                Ver cardápio
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="bg-white rounded-2xl border border-[var(--rose-200)] shadow-sm p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--ink)]">
                      Pedido #{o.id}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--rose-100)] text-[var(--brand-800)]">
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatDate(o.createdAt ?? o.deliveryDateTime)} •{" "}
                    {o.delivery ? "Entrega" : "Retirada"} •{" "}
                    {(o.items ?? []).reduce((s, i) => s + i.quantity, 0)} itens
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--brand-800)]">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(orderTotal(o))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
