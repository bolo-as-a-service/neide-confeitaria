"use client";

import * as React from "react";
import { ClipboardList, User, Check, ChefHat, Package, Truck, Ban, Loader2 } from "lucide-react";
import { KanbanColumn } from "@/components/admin/KanbanColumn";
import { Order } from "@/components/admin/OrderCard";
import { ErrorState } from "@/components/ui/error-state";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { BackendOrder, BackendOrderItem } from "@/lib/types";

function mapOrder(o: BackendOrder): Order {
  const items = o.items ?? [];
  const dt = o.deliveryDateTime ? new Date(o.deliveryDateTime) : null;
  const validDt = dt && !Number.isNaN(dt.getTime()) ? dt : null;
  return {
    id: String(o.id),
    number: o.id,
    type: o.delivery ? "ENTREGA" : "RETIRADA",
    customerName: o.customerName || "Cliente",
    customerPhone: o.phone || "",
    deliveryDate: validDt
      ? validDt.toLocaleDateString("pt-BR")
      : o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("pt-BR")
        : "—",
    deliveryTime: validDt
      ? `${String(validDt.getHours()).padStart(2, "0")}h`
      : "—",
    location: o.address || undefined,
    items: items.map((i: BackendOrderItem) => ({
      name: i.product?.name || `Produto #${i.product?.id}`,
      quantity: i.quantity,
      price: i.unitPrice,
      observation: i.observation || undefined,
    })),
    generalObservations: o.observation || undefined,
    total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  };
}

const COLUMNS = [
  { key: "FILA", variant: "fila" as const, title: "Fila", subtitle: "Aguardando Aprovação", icon: <User className="h-4 w-4" /> },
  { key: "APROVADO", variant: "aprovados" as const, title: "Aprovados", subtitle: "Aguardando para iniciar preparo", icon: <Check className="h-4 w-4" /> },
  { key: "FAZENDO", variant: "fazendo" as const, title: "Fazendo", subtitle: "Em preparo", icon: <ChefHat className="h-4 w-4" /> },
  { key: "PRONTO", variant: "prontos" as const, title: "Prontos", subtitle: "Aguardando entrega/retirada", icon: <Package className="h-4 w-4" /> },
  { key: "ENTREGUE", variant: "entregues" as const, title: "Entregues", subtitle: "Finalizados", icon: <Truck className="h-4 w-4" /> },
  { key: "CANCELADO", variant: "cancelados" as const, title: "Cancelados", subtitle: "Recusados/cancelados", icon: <Ban className="h-4 w-4" /> },
];

const KNOWN_STATUSES = new Set(COLUMNS.map((c) => c.key));

function emptyGrouping(): Record<string, Order[]> {
  return { FILA: [], APROVADO: [], FAZENDO: [], PRONTO: [], ENTREGUE: [], CANCELADO: [] };
}

export default function AdminPedidosPage() {
  const [ordersByStatus, setOrdersByStatus] = React.useState<Record<string, Order[]>>(emptyGrouping);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const all = await api.getOrders();
      const grouped = emptyGrouping();
      all.forEach((o) => {
        const status = o.status || "FILA";
        // Status desconhecido (não deveria ocorrer: o backend valida) vai
        // para a Fila em vez de sumir — mas nunca ENTREGUE/CANCELADO.
        grouped[KNOWN_STATUSES.has(status) ? status : "FILA"].push(mapOrder(o));
      });
      setOrdersByStatus(grouped);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadOrders();
    });
    return () => {
      cancelled = true;
    };
  }, [loadOrders]);

  const moveOrder = async (order: Order, fromStatus: string, toStatus: string) => {
    setOrdersByStatus((prev) => ({
      ...prev,
      [fromStatus]: prev[fromStatus]?.filter((o) => o.id !== order.id) || [],
      [toStatus]: [...(prev[toStatus] || []), { ...order }],
    }));
    try {
      await api.updateOrderStatus(Number(order.id), toStatus);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao mover pedido");
      loadOrders();
    }
  };

  const handleRecusar = async (order: Order) => {
    if (!window.confirm(`Recusar o pedido #${order.number} de ${order.customerName}?`)) return;
    // Otimista: remove da FILA e confirma CANCELADO no backend.
    // Rollback restaura o snapshot em caso de erro.
    const snapshot = ordersByStatus;
    setOrdersByStatus((prev) => ({
      ...prev,
      FILA: prev.FILA?.filter((o) => o.id !== order.id) || [],
    }));
    try {
      await api.updateOrderStatus(Number(order.id), "CANCELADO");
      toast.success(`Pedido #${order.number} recusado.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao recusar pedido");
      setOrdersByStatus(snapshot);
    }
  };

  const handleAceitar = (order: Order) => moveOrder(order, "FILA", "APROVADO");
  const handleIniciarPreparo = (order: Order) => moveOrder(order, "APROVADO", "FAZENDO");
  const handleMarcarPronto = (order: Order) => moveOrder(order, "FAZENDO", "PRONTO");

  const handleMarcarEntregue = async (order: Order) => {
    // Otimista: remove de PRONTO e confirma ENTREGUE no backend (issue #21).
    // Rollback restaura o snapshot em caso de erro.
    const snapshot = ordersByStatus;
    setOrdersByStatus((prev) => ({
      ...prev,
      PRONTO: prev.PRONTO?.filter((o) => o.id !== order.id) || [],
    }));
    try {
      await api.updateOrderStatus(Number(order.id), "ENTREGUE");
      toast.success(`Pedido #${order.number} marcado como entregue.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao concluir pedido");
      setOrdersByStatus(snapshot);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-700)]" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="h-5 w-5 lg:h-6 lg:w-6 text-red-500" />
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Pedidos</h1>
          </div>
        </div>
        <ErrorState message={loadError} onRetry={loadOrders} />
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="h-5 w-5 lg:h-6 lg:w-6 text-red-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Pedidos</h1>
        </div>
        <p className="text-sm text-[var(--muted)] ml-9">
          Acompanhe e gerencie todos os pedidos
        </p>
      </div>

      <div className="flex gap-4 pb-4 overflow-x-auto">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            title={col.title}
            subtitle={col.subtitle}
            icon={col.icon}
            count={ordersByStatus[col.key]?.length || 0}
            orders={ordersByStatus[col.key] || []}
            variant={col.variant}
            onRecusar={col.key === "FILA" ? handleRecusar : undefined}
            onAceitar={col.key === "FILA" ? handleAceitar : undefined}
            onIniciarPreparo={col.key === "APROVADO" ? handleIniciarPreparo : undefined}
            onMarcarPronto={col.key === "FAZENDO" ? handleMarcarPronto : undefined}
            onMarcarEntregue={col.key === "PRONTO" ? handleMarcarEntregue : undefined}
          />
        ))}
      </div>
    </div>
  );
}
