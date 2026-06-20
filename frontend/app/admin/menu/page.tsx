"use client";

import * as React from "react";
import { Cake, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { AdminProductTable, AdminProduct } from "@/components/admin/AdminProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { BackendCategory, BackendProduct } from "@/lib/types";

const categoryColorMap: Record<string, string> = {
  "bolos-cobertura": "rose",
  "bolos-vulcao": "amber",
  "bolos-piscina": "rose",
  "bolos-fit": "green",
  pudins: "rose",
  cestas: "rose",
  congelados: "rose",
  salgados: "amber",
};

function toAdminProduct(p: BackendProduct): AdminProduct {
  const catName = p.category?.name || "Sem categoria";
  return {
    id: String(p.id),
    name: p.name,
    description: p.description || "",
    price: p.price,
    image: p.imageUrl || "/bolo.webp",
    category: catName,
    categoryColor: (categoryColorMap[catName.toLowerCase()] as AdminProduct["categoryColor"]) || "rose",
    available: p.available,
    ingredients: p.ingredients,
  };
}

export default function AdminMenuPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [editProduct, setEditProduct] = React.useState<AdminProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<AdminProduct | null>(null);
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadProducts = React.useCallback(async () => {
    try {
      const data = await api.getProducts();
      setProducts(data.map(toAdminProduct));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product: AdminProduct) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: AdminProduct) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    if (deleteProduct) {
      try {
        await api.deleteProduct(Number(deleteProduct.id));
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      } catch (err) {
        console.error("Failed to delete product", err);
      }
      setDeleteProduct(null);
    }
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    category?: BackendCategory;
    price: string;
    ingredients: string[];
    image?: string;
  }) => {
    const payload: Partial<BackendProduct> = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price.replace(",", ".")),
      ingredients: data.ingredients,
      imageUrl: data.image,
    };
    if (data.category) {
      payload.category = data.category;
    }
    try {
      if (editProduct) {
        const updated = await api.updateProduct(Number(editProduct.id), payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? toAdminProduct(updated) : p))
        );
      } else {
        const created = await api.createProduct(payload);
        setProducts((prev) => [...prev, toAdminProduct(created)]);
      }
      setShowForm(false);
      setEditProduct(null);
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-700)]" />
      </div>
    );
  }

  if (showForm) {
    return <ProductForm onBack={() => { setShowForm(false); setEditProduct(null); }} editProduct={editProduct} onSave={handleSave} />;
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
        products={products}
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
