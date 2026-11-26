"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { Header } from "@/components/menu/Header";
import { Footer } from "@/components/menu/Footer";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Price, formatBRL } from "@/components/ui/price";
import { StatusPill } from "@/components/ui/status-pill";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { useAuth } from "@/lib/auth-context";
import { ApiError, api } from "@/lib/api";
import type { BackendOrder } from "@/lib/types";

const ACTIVE_STATUSES = ["FILA", "APROVADO", "FAZENDO", "PRONTO"];
const DONE_STATUSES = ["ENTREGUE", "CANCELADO"];

type OrderFilter = "todos" | "ativos" | "finalizados";

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
  const [filter, setFilter] = React.useState<OrderFilter>("todos");

  const counts = React.useMemo(
    () => ({
      todos: orders.length,
      ativos: orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
      finalizados: orders.filter((o) => DONE_STATUSES.includes(o.status)).length,
    }),
    [orders]
  );

  const filteredOrders = React.useMemo(() => {
    if (filter === "ativos") return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    if (filter === "finalizados") return orders.filter((o) => DONE_STATUSES.includes(o.status));
    return orders;
  }, [orders, filter]);

  const load = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      // Pedidos vinculados à conta (privado por usuário no servidor).
      // Fallback para busca por nome se o backend ainda não tem /mine.
      let data: BackendOrder[];
      try {
        data = await api.getMyOrders();
      } catch (err) {
        if (err instanceof ApiError && err.status === 404 && user.name) {
          data = await api.getOrdersByCustomer(user.name);
        } else {
          throw err;
        }
      }
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
      <div className="min-h-dvh bg-[var(--page-bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Verificando acesso…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--page-bg)] font-body">
      <Header cartCount={0} onCartClick={() => router.push("/carrinho")} />

      <main className="max-w-[1020px] mx-auto px-4 sm:px-6 py-6 pb-12">
        <div className="rounded-[var(--radius-card-lg)] bg-[var(--brand-900)] texture-sprinkles text-[var(--cream)] p-6 sm:p-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_18px_44px_-20px_rgba(43,21,20,0.65)]">
          <div>
            <p className="font-script text-2xl text-[var(--rose-200)]">minha caixinha de doces</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Meus pedidos</h1>
            <p className="mt-1 text-sm text-[var(--rose-100)]/90">
              Acompanhe os pedidos feitos como {user.name}
            </p>
          </div>
          <button
            onClick={() => router.push("/cardapio")}
            className="inline-flex items-center justify-center rounded-full bg-[var(--cream)] px-5 py-2.5 text-sm font-bold text-[var(--brand-900)] hover:bg-white transition-colors whitespace-nowrap"
          >
            + Novo pedido
          </button>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filtrar pedidos">
            {(
              [
                { id: "todos", label: "Todos" },
                { id: "ativos", label: "Em andamento" },
                { id: "finalizados", label: "Finalizados" },
              ] as const
            ).map((opt) => {
              const selected = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFilter(opt.id)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold transition-all ${
                    selected
                      ? "border-[var(--brand-900)] bg-[var(--brand-900)] text-[var(--cream)] shadow-md"
                      : "border-[var(--rose-200)] bg-white text-[var(--brand-800)] hover:border-[var(--brand-600)]"
                  }`}
                >
                  {opt.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                      selected ? "bg-white/20 text-[var(--cream)]" : "bg-[var(--rose-100)] text-[var(--brand-800)]"
                    }`}
                  >
                    {counts[opt.id]}
                  </span>
                </button>
              );
            })}
          </div>
          {loading ? (
            <div className="space-y-3" aria-label="Carregando pedidos">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-card)] border border-[var(--rose-200)] bg-white p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-2/3 rounded-full" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center bg-white rounded-[var(--radius-card-lg)] border border-dashed border-[var(--ring)] shadow-sm px-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rose-100)]">
                <PackageSearch className="h-8 w-8 text-[var(--brand-700)]" />
              </div>
              <p className="font-display text-xl font-bold text-[var(--brand-900)]">
                {filter === "todos" ? "Nenhum pedido ainda" : "Nada por aqui"}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {filter === "todos"
                  ? "Sua caixinha está vazia — que tal adoçar o dia?"
                  : filter === "ativos"
                    ? "Você não tem pedidos em andamento."
                    : "Nenhum pedido finalizado por enquanto."}
              </p>
              <button
                onClick={() => {
                  if (filter === "todos") router.push("/cardapio");
                  else setFilter("todos");
                }}
                className="mt-4 inline-flex items-center rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-bold text-[var(--cream)] hover:bg-[var(--brand-800)] transition-colors"
              >
                {filter === "todos" ? "Ver cardápio" : "Ver todos"}
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredOrders.map((o) => (
                <li
                  key={o.id}
                  className="bg-white rounded-[var(--radius-card)] border border-[var(--rose-200)] shadow-[0_8px_24px_-14px_rgba(75,40,32,0.35)] p-5 card-lift"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--brand-900)]">
                      Pedido #{o.id}
                    </span>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--muted)]">
                    {formatDate(o.createdAt ?? o.deliveryDateTime)} •{" "}
                    {o.delivery ? "Entrega" : "Retirada"} •{" "}
                    {(o.items ?? []).reduce((s, i) => s + i.quantity, 0)} {(o.items ?? []).reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "itens"}
                  </p>
                  <OrderTimeline status={o.status} />
                  {(o.items ?? []).length > 0 && (
                    <ul className="mt-3 space-y-1 rounded-xl bg-[var(--rose-50)]/70 px-3 py-2.5 text-xs text-[var(--ink)]">
                      {(o.items ?? []).slice(0, 4).map((it, idx) => (
                        <li key={idx} className="flex justify-between gap-2">
                          <span className="truncate">{it.quantity}x {it.product?.name ?? `Produto #${it.product?.id}`}</span>
                          <span className="font-semibold whitespace-nowrap">{formatBRL(it.unitPrice * it.quantity)}</span>
                        </li>
                      ))}
                      {(o.items ?? []).length > 4 && (
                        <li className="text-[var(--muted)]">+ {(o.items ?? []).length - 4} outros itens…</li>
                      )}
                    </ul>
                  )}
                  <Price
                    value={orderTotal(o)}
                    className="mt-2.5 block text-base font-extrabold text-[var(--brand-800)] font-display"
                  />
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
