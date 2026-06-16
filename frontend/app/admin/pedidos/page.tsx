"use client";

import * as React from "react";
import { ClipboardList, User, Check, ChefHat, Package } from "lucide-react";
import { KanbanColumn } from "@/components/admin/KanbanColumn";
import { Order } from "@/components/admin/OrderCard";

const MOCK_ORDERS: Record<string, Order[]> = {
  fila: [
    {
      id: "1",
      number: 54,
      type: "RETIRADA",
      customerName: "Marina Silva",
      customerPhone: "(11) 9 1223 1231",
      deliveryDate: "20/06/2025",
      deliveryTime: "14h",
      items: [
        { name: "Bolo de maracujá", quantity: 2, price: 70, observation: "Não usar açucar de confeiteiro" },
        { name: "Bolo de coco", quantity: 1, price: 70, observation: "Sem cobertura" },
      ],
      generalObservations: "Sem cobertura",
      total: 210,
    },
    {
      id: "2",
      number: 54,
      type: "ENTREGA",
      customerName: "Marina Silva",
      customerPhone: "(11) 9 1223 1231",
      deliveryDate: "20/06/2025",
      deliveryTime: "14h",
      location: "Rua borba gato carrapato",
      items: [
        { name: "Bolo de maracujá", quantity: 2, price: 70, observation: "Não usar açucar de confeiteiro" },
        { name: "Bolo de coco", quantity: 1, price: 70, observation: "Sem cobertura" },
      ],
      generalObservations: "Sem cobertura",
      total: 210,
    },
    {
      id: "3",
      number: 55,
      type: "RETIRADA",
      customerName: "João Santos",
      customerPhone: "(11) 9 8765 4321",
      deliveryDate: "21/06/2025",
      deliveryTime: "10h",
      items: [
        { name: "Bolo de chocolate", quantity: 1, price: 85 },
      ],
      total: 85,
    },
  ],
  aprovados: [
    {
      id: "4",
      number: 54,
      type: "RETIRADA",
      customerName: "Marina Silva",
      customerPhone: "(11) 9 1223 1231",
      deliveryDate: "20/06/2025",
      deliveryTime: "14h",
      items: [
        { name: "Bolo de maracujá", quantity: 2, price: 70, observation: "Não usar açucar de confeiteiro" },
        { name: "Bolo de coco", quantity: 1, price: 70, observation: "Sem cobertura" },
      ],
      generalObservations: "Sem cobertura",
      total: 210,
    },
  ],
  fazendo: [
    {
      id: "5",
      number: 54,
      type: "RETIRADA",
      customerName: "Marina Silva",
      customerPhone: "(11) 9 1223 1231",
      deliveryDate: "20/06/2025",
      deliveryTime: "14h",
      items: [
        { name: "Bolo de maracujá", quantity: 2, price: 70, observation: "Não usar açucar de confeiteiro" },
        { name: "Bolo de coco", quantity: 1, price: 70, observation: "Sem cobertura" },
      ],
      generalObservations: "Sem cobertura",
      total: 210,
    },
    {
      id: "6",
      number: 53,
      type: "ENTREGA",
      customerName: "Ana Costa",
      customerPhone: "(11) 9 3344 5566",
      deliveryDate: "20/06/2025",
      deliveryTime: "16h",
      location: "Av. Paulista, 1000",
      items: [
        { name: "Bolo vulcão", quantity: 1, price: 85 },
      ],
      total: 85,
    },
  ],
  prontos: [
    {
      id: "7",
      number: 54,
      type: "RETIRADA",
      customerName: "Marina Silva",
      customerPhone: "(11) 9 1223 1231",
      deliveryDate: "20/06/2025",
      deliveryTime: "14h",
      items: [
        { name: "Bolo de maracujá", quantity: 2, price: 70, observation: "Não usar açucar de confeiteiro" },
        { name: "Bolo de coco", quantity: 1, price: 70, observation: "Sem cobertura" },
      ],
      generalObservations: "Sem cobertura",
      total: 210,
    },
    {
      id: "8",
      number: 52,
      type: "ENTREGA",
      customerName: "Pedro Oliveira",
      customerPhone: "(11) 9 9988 7766",
      deliveryDate: "19/06/2025",
      deliveryTime: "18h",
      location: "Rua Augusta, 500",
      items: [
        { name: "Mini Esfihas", quantity: 2, price: 70 },
      ],
      total: 140,
    },
  ],
};

const COLUMNS = [
  { key: "fila" as const, title: "Fila", subtitle: "Aguardando Aprovação", icon: <User className="h-4 w-4" /> },
  { key: "aprovados" as const, title: "Aprovados", subtitle: "Aguardando para iniciar preparo", icon: <Check className="h-4 w-4" /> },
  { key: "fazendo" as const, title: "Fazendo", subtitle: "Em preparo", icon: <ChefHat className="h-4 w-4" /> },
  { key: "prontos" as const, title: "Prontos", subtitle: "Aguardando entrega/retirada", icon: <Package className="h-4 w-4" /> },
];

export default function AdminPedidosPage() {
  const [orders, setOrders] = React.useState(MOCK_ORDERS);

  const handleRecusar = (order: Order) => {
    setOrders((prev) => ({
      ...prev,
      fila: prev.fila.filter((o) => o.id !== order.id),
    }));
  };

  const handleAceitar = (order: Order) => {
    setOrders((prev) => ({
      ...prev,
      fila: prev.fila.filter((o) => o.id !== order.id),
      aprovados: [...prev.aprovados, order],
    }));
  };

  const handleIniciarPreparo = (order: Order) => {
    setOrders((prev) => ({
      ...prev,
      aprovados: prev.aprovados.filter((o) => o.id !== order.id),
      fazendo: [...prev.fazendo, order],
    }));
  };

  const handleMarcarPronto = (order: Order) => {
    setOrders((prev) => ({
      ...prev,
      fazendo: prev.fazendo.filter((o) => o.id !== order.id),
      prontos: [...prev.prontos, order],
    }));
  };

  const handleMarcarEntregue = (order: Order) => {
    setOrders((prev) => ({
      ...prev,
      prontos: prev.prontos.filter((o) => o.id !== order.id),
    }));
  };

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
            count={orders[col.key].length}
            orders={orders[col.key]}
            variant={col.key}
            onRecusar={handleRecusar}
            onAceitar={handleAceitar}
            onIniciarPreparo={handleIniciarPreparo}
            onMarcarPronto={handleMarcarPronto}
            onMarcarEntregue={handleMarcarEntregue}
          />
        ))}
      </div>
    </div>
  );
}