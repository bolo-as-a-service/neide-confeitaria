"use client";

import * as React from "react";
import { ClipboardList, User, Check, ChefHat, Package, Loader2 } from "lucide-react";
import { KanbanColumn } from "@/components/admin/KanbanColumn";
import { Order } from "@/components/admin/OrderCard";
import { api } from "@/lib/api";
import type { BackendOrder, BackendOrderItem } from "@/lib/types";

function mapOrder(o: BackendOrder): Order {
  const dt = o.deliveryDateTime ? new Date(o.deliveryDateTime) : null;
  return {
    id: String(o.id),
    number: o.id,
    type: o.delivery ? "ENTREGA" : "RETIRADA",
    customerName: o.customerName || "Cliente",
    customerPhone: o.phone || "",
    deliveryDate: dt
      ? dt.toLocaleDateString("pt-BR")
      : o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("pt-BR")
        : "—",
    deliveryTime: dt
      ? `${String(dt.getHours()).padStart(2, "0")}h`
      : "—",
    location: o.address || undefined,
    items: o.items.map((i: BackendOrderItem) => ({
      name: i.product?.name || `Produto #${i.product?.id}`,
      quantity: i.quantity,
      price: i.unitPrice,
      observation: i.observation || undefined,
    })),
    generalObservations: o.observation || undefined,
    total: o.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  };
}

const COLUMNS = [
  { key: "FILA", variant: "fila" as const, title: "Fila", subtitle: "Aguardando Aprovação", icon: <User className="h-4 w-4" /> },
  { key: "APROVADO", variant: "aprovados" as const, title: "Aprovados", subtitle: "Aguardando para iniciar preparo", icon: <Check className="h-4 w-4" /> },
  { key: "FAZENDO", variant: "fazendo" as const, title: "Fazendo", subtitle: "Em preparo", icon: <ChefHat className="h-4 w-4" /> },
  { key: "PRONTO", variant: "prontos" as const, title: "Prontos", subtitle: "Aguardando entrega/retirada", icon: <Package className="h-4 w-4" /> },
];

export default function AdminPedidosPage() {
  const [ordersByStatus, setOrdersByStatus] = React.useState<Record<string, Order[]>>({
    FILA: [],
    APROVADO: [],
    FAZENDO: [],
    PRONTO: [],
  });
  const [loading, setLoading] = React.useState(true);

  const loadOrders = React.useCallback(async () => {
    try {
      const all = await api.getOrders();
      const grouped: Record<string, Order[]> = {
        FILA: [],
        APROVADO: [],
        FAZENDO: [],
        PRONTO: [],
      };
      all.forEach((o) => {
        const status = o.status || "FILA";
        if (grouped[status]) {
          grouped[status].push(mapOrder(o));
        } else {
          grouped["FILA"].push(mapOrder(o));
        }
      });
      setOrdersByStatus(grouped);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
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
      console.error("Failed to update order status", err);
      loadOrders();
    }
  };

  const handleRecusar = (order: Order) => {
    setOrdersByStatus((prev) => ({
      ...prev,
      FILA: prev.FILA?.filter((o) => o.id !== order.id) || [],
    }));
  };

  const handleAceitar = (order: Order) => moveOrder(order, "FILA", "APROVADO");
  const handleIniciarPreparo = (order: Order) => moveOrder(order, "APROVADO", "FAZENDO");
  const handleMarcarPronto = (order: Order) => moveOrder(order, "FAZENDO", "PRONTO");

  const handleMarcarEntregue = (order: Order) => {
    setOrdersByStatus((prev) => ({
      ...prev,
      PRONTO: prev.PRONTO?.filter((o) => o.id !== order.id) || [],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-700)]" />
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
