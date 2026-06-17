"use client";

import * as React from "react";
import { Cake, Plus, AlertTriangle } from "lucide-react";
import { AdminProductTable, AdminProduct } from "@/components/admin/AdminProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MOCK_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: "1",
    name: "Bolo de cenoura",
    description: "Bolo de cenoura 45x45 com cobertura...",
    price: 65,
    image: "/bolo.webp",
    category: "Caseiro",
    categoryColor: "rose",
  },
  {
    id: "2",
    name: "Bolo de coco",
    description: "Bolo de coco 35x47 com cobertura...",
    price: 75,
    image: "/bolo.webp",
    category: "Caseiro",
    categoryColor: "red",
  },
  {
    id: "3",
    name: "Bolo Diet",
    description: "Bolo de Fit Low Carbo 15x15",
    price: 65,
    image: "/bolo.webp",
    category: "Diet",
    categoryColor: "green",
  },
  {
    id: "4",
    name: "Bolo Vulcão 1",
    description: "Bolo de Vulcão c/ cobertura de morango 45x4..",
    price: 85,
    image: "/bolo.webp",
    category: "Vulcão",
    categoryColor: "amber",
  },
  {
    id: "5",
    name: "Bolo Vulcão 2",
    description: "Bolo de Vulcão c/ cobertura de coco 45x4..",
    price: 45,
    image: "/bolo.webp",
    category: "Vulcão",
    categoryColor: "amber",
  },
];

export default function AdminMenuPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [editProduct, setEditProduct] = React.useState<AdminProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<AdminProduct | null>(null);

  const handleEdit = (product: AdminProduct) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: AdminProduct) => {
    setDeleteProduct(product);
  };

  const confirmDelete = () => {
    if (deleteProduct) {
      console.log("Deleting product:", deleteProduct.id);
      setDeleteProduct(null);
    }
  };

  if (showForm) {
    return <ProductForm onBack={() => { setShowForm(false); setEditProduct(null); }} editProduct={editProduct} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Cake className="h-5 w-5 lg:h-6 lg:w-6 text-[var(--brand-700)]" />
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--ink)]">Menu de Produtos</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 lg:gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-[var(--cream)] px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Novo Produto
          </button>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Gerencie os produtos disponíveis no cardápio
        </p>
      </div>

      <AdminProductTable
        products={MOCK_ADMIN_PRODUCTS}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent className="max-w-sm p-6 text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--ink)]">
              Excluir produto
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted)] mb-6">
            Tem certeza que deseja remover <strong>{deleteProduct?.name}</strong> do cardápio?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setDeleteProduct(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Sim, excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}